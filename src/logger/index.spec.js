import { Logger, LOGGING_LEVEL } from './index';

describe('Logger', () => {
    beforeEach(() => {
        spyOn(console, 'log');
        spyOn(console, 'info');
        spyOn(console, 'warn');
        spyOn(console, 'debug');
        spyOn(console, 'error');
    });

    describe('Logging Level Silent', () => {
        beforeEach(() => {
            Logger.setLoggingLevel(LOGGING_LEVEL.SILENT);
        });

        it('should not log for log', () => {
            const logMessage = 'Never gonna give you up';

            Logger.log(logMessage);

            expect(console.log).not.toHaveBeenCalled();
        });

        it('should not log for info', () => {
            const logMessage = 'Never gonna let you down';

            Logger.info(logMessage);

            expect(console.info).not.toHaveBeenCalled();
        });

        it('should not log for warn', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.warn(logMessage);

            expect(console.warn).not.toHaveBeenCalled();
        });

        it('should log for error', () => {
            const logMessage = 'Never gonna make you cry';

            Logger.error(logMessage);

            expect(console.error).toHaveBeenCalledWith('ERROR:', logMessage);
        });
    });

    describe('Logging Level Standard', () => {
        beforeEach(() => {
            Logger.setLoggingLevel(LOGGING_LEVEL.STANDARD);
        });

        it('should log for log', () => {
            const logMessage = 'Never gonna give you up';

            Logger.log(logMessage);

            expect(console.log).toHaveBeenCalledWith('LOG:', logMessage);
        });

        it('should not log for info', () => {
            const logMessage = 'Never gonna let you down';

            Logger.info(logMessage);

            expect(console.info).not.toHaveBeenCalled();
        });

        it('should log for warn', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.warn(logMessage);

            expect(console.warn).toHaveBeenCalledWith('WARN:', logMessage);
        });

        it('should log for error', () => {
            const logMessage = 'Never gonna make you cry';

            Logger.error(logMessage);

            expect(console.error).toHaveBeenCalledWith('ERROR:', logMessage);
        });
    });

    describe('Logging Level Verbose', () => {
        beforeEach(() => {
            Logger.setLoggingLevel(LOGGING_LEVEL.VERBOSE);
        });

        it('should log for log', () => {
            const logMessage = 'Never gonna give you up';

            Logger.log(logMessage);

            expect(console.log).toHaveBeenCalledWith('LOG:', logMessage);
        });

        it('should log for info', () => {
            const logMessage = 'Never gonna let you down';

            Logger.info(logMessage);

            expect(console.info).toHaveBeenCalledWith('INFO:', logMessage);
        });

        it('should log for warn', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.warn(logMessage);

            expect(console.warn).toHaveBeenCalledWith('WARN:', logMessage);
        });

        it('should NOT log for debug', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.debug(logMessage);

            expect(console.debug).not.toHaveBeenCalled();
        });

        it('should log for error', () => {
            const logMessage = 'Never gonna make you cry';

            Logger.error(logMessage);

            expect(console.error).toHaveBeenCalledWith('ERROR:', logMessage);
        });
    });

    describe('Logging Level Debug', () => {
        beforeEach(() => {
            Logger.setLoggingLevel(LOGGING_LEVEL.DEBUG);
        });

        it('should log for log', () => {
            const logMessage = 'Never gonna give you up';

            Logger.log(logMessage);

            expect(console.log).toHaveBeenCalledWith('LOG:', logMessage);
        });

        it('should log for info', () => {
            const logMessage = 'Never gonna let you down';

            Logger.info(logMessage);

            expect(console.info).toHaveBeenCalledWith('INFO:', logMessage);
        });

        it('should log for warn', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.warn(logMessage);

            expect(console.warn).toHaveBeenCalledWith('WARN:', logMessage);
        });

        it('should log for debug', () => {
            const logMessage = 'Never gonna run around and desert you';

            Logger.debug(logMessage);

            expect(console.debug).toHaveBeenCalledWith('DEBUG:', logMessage);
        });

        it('should log for error', () => {
            const logMessage = 'Never gonna make you cry';

            Logger.error(logMessage);

            expect(console.error).toHaveBeenCalledWith('ERROR:', logMessage);
        });
    });
});