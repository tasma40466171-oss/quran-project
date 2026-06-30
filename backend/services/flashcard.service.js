// services/flashcard.service.js
"use strict";

const flashcardRepo = require("../repositories/flashcard.repository");
const folderRepo = require("../repositories/folder.repository");
const AppError = require("../utils/AppError");

/**
 * Validate flashcard set data
 */
function validateFlashcardSet(name, cards) {
    if (!name || typeof name !== "string" || !name.trim()) {
        throw new AppError("name is required and must be a non-empty string.", 400);
    }
    if (!Array.isArray(cards) || cards.length === 0) {
        throw new AppError("cards must be a non-empty array.", 400);
    }
    for (const card of cards) {
        if (!card.front || !card.back) {
            throw new AppError("Each card must have front and back properties.", 400);
        }
    }
}

/**
 * Validate folder data
 */
function validateFolder(name, color) {
    if (!name || typeof name !== "string" || !name.trim()) {
        throw new AppError("name is required and must be a non-empty string.", 400);
    }
}

/**
 * Create flashcard set
 */
async function createFlashcardSet(userId, name, cards) {
    validateFlashcardSet(name, cards);
    
    console.log('[FLASHCARD CREATE] Creating set with name:', name.trim(), 'for user:', userId);

    const setId = await flashcardRepo.createSet(userId, name);
    await flashcardRepo.bulkInsertCards(setId, cards);

    console.log('[FLASHCARD CREATE] Set created with ID:', setId, 'name:', name.trim());

    return {
        id: setId,
        name: name.trim(),
        cardCount: cards.length,
        created_at: new Date().toISOString(),
    };
}

/**
 * Get flashcard set by ID
 */
async function getFlashcardSet(userId, setId) {
    console.log('[FLASHCARD FETCH] Fetching set ID:', setId, 'for user:', userId);
    const set = await flashcardRepo.getSetByIdAndUser(setId, userId);
    if (!set) {
        throw new AppError("Set not found.", 404);
    }

    console.log('[FLASHCARD FETCH] Found set:', set.id, 'name:', set.name);
    const cards = await flashcardRepo.getCardsBySet(setId);
    console.log('[FLASHCARD FETCH] Cards count:', cards.length);
    
    return { ...set, cards };
}

/**
 * Rename flashcard set
 */
async function renameFlashcardSet(userId, setId, name) {
    if (!name || typeof name !== "string" || !name.trim()) {
        throw new AppError("name is required and must be a non-empty string.", 400);
    }

    const changes = await flashcardRepo.renameSet(setId, userId, name);
    if (changes === 0) {
        throw new AppError("Set not found.", 404);
    }

    return { id: setId, name: name.trim(), message: "Set renamed successfully." };
}

/**
 * Delete flashcard set
 */
async function deleteFlashcardSet(userId, setId) {
    const changes = await flashcardRepo.deleteSet(setId, userId);
    if (changes === 0) {
        throw new AppError("Set not found.", 404);
    }
}

/**
 * Create folder
 */
async function createFolder(userId, name, color) {
    validateFolder(name, color);
    
    const folderId = await folderRepo.createFolder(userId, name.trim(), color || '#1B4332');
    return { id: folderId, name: name.trim(), color: color || '#1B4332' };
}

/**
 * Delete folder
 */
async function deleteFolder(userId, folderId) {
    const changes = await folderRepo.deleteFolder(folderId, userId);
    if (changes === 0) {
        throw new AppError("Folder not found.", 404);
    }
}

/**
 * Rename folder
 */
async function renameFolder(userId, folderId, name) {
    if (!name || typeof name !== "string" || !name.trim()) {
        throw new AppError("name is required and must be a non-empty string.", 400);
    }

    const changes = await folderRepo.renameFolder(folderId, userId, name.trim());
    if (changes === 0) {
        throw new AppError("Folder not found.", 404);
    }

    return { id: folderId, name: name.trim(), message: "Folder renamed successfully." };
}

/**
 * Add items to folder
 */
async function addItemsToFolder(userId, folderId, items) {
    if (!Array.isArray(items) || items.length === 0) {
        throw new AppError("items must be a non-empty array.", 400);
    }
    
    for (const item of items) {
        if (!item.set_id || !item.set_type) {
            throw new AppError("Each item must have set_id and set_type.", 400);
        }
        await folderRepo.addItemToFolder(folderId, userId, item.set_id, item.set_type);
    }
    
    return `${items.length} items added to folder.`;
}

/**
 * Add single item to folder
 */
async function addItemToFolder(userId, folderId, set_id, set_type) {
    if (!set_id || !set_type) {
        throw new AppError("set_id and set_type are required.", 400);
    }
    
    await folderRepo.addItemToFolder(folderId, userId, set_id, set_type);
    return "Item added to folder.";
}

/**
 * Remove item from folder
 */
async function removeItemFromFolder(userId, folderId, setId) {
    const changes = await folderRepo.removeItemFromFolder(folderId, userId, setId);
    if (changes === 0) {
        throw new AppError("Item not found in folder.", 404);
    }
    return "Item removed from folder.";
}

module.exports = {
    createFlashcardSet,
    getFlashcardSet,
    renameFlashcardSet,
    deleteFlashcardSet,
    createFolder,
    deleteFolder,
    renameFolder,
    addItemsToFolder,
    addItemToFolder,
    removeItemFromFolder,
};
