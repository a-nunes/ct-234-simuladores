import { generateSteps } from '@features/lcs/data/stepGenerators/LCSStepGenerator';
import { LCSConfig } from '@features/lcs/domain/entities/LCSConfig';
import { LCSStep } from '@features/lcs/domain/entities/LCSStep';

describe('LCSStepGenerator', () => {
  describe('generateSteps', () => {
    it('should generate initial step', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      expect(steps.length).toBeGreaterThan(0);
      expect(steps[0].type).toBe('init');
      expect(steps[0].description).toContain('Inicializando algoritmo LCS');
    });

    it('should generate fill_borders step', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      const fillStep = steps.find(step => step.type === 'fill_borders');
      expect(fillStep).toBeDefined();
      expect(fillStep?.description).toContain('Preenchendo linha 0 e coluna 0');
    });

    it('should generate process_cell steps for each cell', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'AB'
      };
      const steps = generateSteps(config);
      
      const processSteps = steps.filter(step => step.type === 'process_cell');
      expect(processSteps.length).toBe(4); // 2x2 = 4 cells
    });

    it('should generate match steps when characters match', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'AB'
      };
      const steps = generateSteps(config);
      
      const matchSteps = steps.filter(step => step.type === 'match');
      expect(matchSteps.length).toBeGreaterThan(0);
      matchSteps.forEach(step => {
        expect(step.i).toBeDefined();
        expect(step.j).toBeDefined();
        expect(step.description).toContain('==');
      });
    });

    it('should generate no_match_up steps when going up', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'CD'
      };
      const steps = generateSteps(config);
      
      const noMatchSteps = steps.filter(step => 
        step.type === 'no_match_up' || step.type === 'no_match_left'
      );
      expect(noMatchSteps.length).toBeGreaterThan(0);
    });

    it('should generate start_traceback step', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      const tracebackStep = steps.find(step => step.type === 'start_traceback');
      expect(tracebackStep).toBeDefined();
      expect(tracebackStep?.tracebackI).toBeDefined();
      expect(tracebackStep?.tracebackJ).toBeDefined();
      expect(tracebackStep?.description).toContain('Iniciando traceback');
    });

    it('should generate traceback_step steps', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      const tracebackSteps = steps.filter(step => step.type === 'traceback_step');
      expect(tracebackSteps.length).toBeGreaterThan(0);
      tracebackSteps.forEach(step => {
        expect(step.tracebackI).toBeDefined();
        expect(step.tracebackJ).toBeDefined();
      });
    });

    it('should generate complete step with final LCS', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      const completeStep = steps[steps.length - 1];
      expect(completeStep.type).toBe('complete');
      expect(completeStep.lcs).toBeDefined();
      expect(completeStep.description).toContain('Traceback concluído');
    });

    it('should have correct table dimensions in all steps', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'DEF'
      };
      const steps = generateSteps(config);
      
      steps.forEach(step => {
        expect(step.c.length).toBe(4); // m + 1
        expect(step.c[0].length).toBe(4); // n + 1
        expect(step.trace.length).toBe(4);
        expect(step.trace[0].length).toBe(4);
      });
    });

    it('should clone tables correctly (no mutation)', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'AB'
      };
      const steps = generateSteps(config);
      
      // Check that each step has independent table copies
      const firstStep = steps[0];
      const lastStep = steps[steps.length - 1];
      
      // Modify first step's table
      firstStep.c[0][0] = 999;
      
      // Last step should not be affected
      expect(lastStep.c[0][0]).not.toBe(999);
    });

    it('should handle single character strings', () => {
      const config: LCSConfig = {
        stringX: 'A',
        stringY: 'A'
      };
      const steps = generateSteps(config);
      
      expect(steps.length).toBeGreaterThan(0);
      const completeStep = steps[steps.length - 1];
      expect(completeStep.lcs).toBe('A');
    });

    it('should handle strings with no common characters', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'XYZ'
      };
      const steps = generateSteps(config);
      
      const completeStep = steps[steps.length - 1];
      expect(completeStep.lcs).toBe('');
    });

    it('should include LCS in traceback steps', () => {
      const config: LCSConfig = {
        stringX: 'ABC',
        stringY: 'ABC'
      };
      const steps = generateSteps(config);
      
      const tracebackSteps = steps.filter(step => step.type === 'traceback_step');
      tracebackSteps.forEach(step => {
        expect(step.lcs).toBeDefined();
        expect(typeof step.lcs).toBe('string');
      });
    });

    it('should process cells in correct order (row by row)', () => {
      const config: LCSConfig = {
        stringX: 'AB',
        stringY: 'CD'
      };
      const steps = generateSteps(config);
      
      const processSteps = steps.filter(step => step.type === 'process_cell');
      expect(processSteps.length).toBe(4);
      
      // Check order: (1,1), (1,2), (2,1), (2,2)
      expect(processSteps[0].i).toBe(1);
      expect(processSteps[0].j).toBe(1);
      expect(processSteps[1].i).toBe(1);
      expect(processSteps[1].j).toBe(2);
      expect(processSteps[2].i).toBe(2);
      expect(processSteps[2].j).toBe(1);
      expect(processSteps[3].i).toBe(2);
      expect(processSteps[3].j).toBe(2);
    });
  });
});

