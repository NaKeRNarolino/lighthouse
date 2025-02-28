import { RuntimeValue } from './values.ts'


export default class Environment {
    private parent?: Environment;
    private variables: Map<string, RuntimeValue>;

    constructor(parentEnv?: Environment) {
        this.parent = parentEnv;
        this.variables = new Map();
    }


    public varDec(varName: string, value: RuntimeValue): RuntimeValue {
        if(this.variables.has(varName)) {
            throw `Variable declaration failed ${varName}. It already exists.`;
        }

        this.variables.set(varName, value);
        return value;
    }


    public varAssign(varName: string, value: RuntimeValue): RuntimeValue {
        const env = this.resolve(varName);
        env.variables.set(varName, value);
        return value;
    }


    public lookUpVar(varName: string): RuntimeValue {
        const env = this.resolve(varName);
        return env.variables.get(varName) as RuntimeValue;
    }

    
    public resolve(varName: string): Environment {
        if(this.variables.has(varName)) {
            return this;
        }
        if(this.parent == undefined) {
            throw `Cannot resolve ${varName}`;
        }

        return this.parent.resolve(varName);
    }
}