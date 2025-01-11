declare module "./data/conditionsData" {
    interface Condition {
      content: string;
      description: string;
    }
  
    const conditions: Condition[];
    export default conditions;
  }
  