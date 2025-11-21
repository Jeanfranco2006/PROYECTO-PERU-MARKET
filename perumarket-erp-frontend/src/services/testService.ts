// testService.ts
import { api } from './api';

export interface TestResult {
  success: boolean;
  message: string;
  data?: any;
}

export const testService = {
  async testBackendConnection(): Promise<TestResult> {
    try {
      const response = await api.get('/test/backend');
      return {
        success: true,
        message: `✅ BACKEND CONECTADO: ${response.data}`,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ ERROR BACKEND: ${error.message}`,
        data: error
      };
    }
  },

  async testDatabaseConnection(): Promise<TestResult> {
    try {
      const response = await api.get('/test/database');
      return {
        success: true,
        message: `✅ BASE DE DATOS CONECTADA: ${response.data}`,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: `❌ ERROR BASE DE DATOS: ${error.message}`,
        data: error
      };
    }
  },

  async testFullConnection(): Promise<{
    backend: TestResult;
    database: TestResult;
    summary: string;
  }> {
    const [backendResult, databaseResult] = await Promise.all([
      this.testBackendConnection(),
      this.testDatabaseConnection()
    ]);

    const allSuccess = backendResult.success && databaseResult.success;

    return {
      backend: backendResult,
      database: databaseResult,
      summary: `
🌐 ESTADO DE CONEXIONES:

${backendResult.message}
${databaseResult.message}

🎯 CONCLUSIÓN: ${allSuccess 
  ? 'TODO CONECTADO CORRECTAMENTE' 
  : 'HAY ERRORES EN LA CONEXIÓN'}
      `.trim()
    };
  }
};