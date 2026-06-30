# Scheduler Services

Services for Quran memorization scheduling and planning.

## Structure

- `intelligence/` - Analysis and generation services
  - `aqmosAnalysis.service.js` - AQMOS learning style analysis
  - `pageAnalysis.service.js` - Page-level analysis
  - `priorityEngine.service.js` - Priority calculation engine
  - `timeEstimation.service.js` - Time estimation for memorization
  - `generators/` - Schedule generators (jadeed, juzHali, murajaah)
  - `revisionUnitGenerator.service.js` - Revision unit generation
- `planning/` - Planning services
  - `dailyWorkloadPlanner.service.js` - Daily workload planning
  - `weeklyStrategy.service.js` - Weekly strategy planning
- `scheduling/` - Scheduling services
  - `adaptiveSplitter.service.js` - Adaptive task splitting
  - `constraint.service.js` - Scheduling constraints
  - `timeline.service.js` - Timeline management
  - `unitScheduler.service.js` - Unit-level scheduling
