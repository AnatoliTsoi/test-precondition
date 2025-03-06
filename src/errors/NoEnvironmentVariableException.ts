export class NoEnvironmentVariableException extends Error {
    constructor(variableName: string) {
        super(`Environment variable ${variableName} must be set`);
        this.name = 'NoEnvironmentVariableException';
    }
}