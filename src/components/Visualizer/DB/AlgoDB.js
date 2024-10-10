import initSqlJs from "sql.js";

class DB{
    constructor() {
        this.SQL = null;
        this.db = null;
        this.isOpen = false;
    }

    async init() {
        this.SQL = await initSqlJs({
            locateFile: file => `https://sql.js.org/dist/${file}`
        });
        
        this.response = await fetch('AlgoDB/AlgoDB.sqlite');
        this.arrayBuffer = await this.response.arrayBuffer();
        
        this.db = new this.SQL.Database(new Uint8Array(this.arrayBuffer));
        this.isOpen = true;
    }

    getNames() {
        const result = this.db.exec("SELECT name FROM ALGORITHMS");
        this.db.close();
        
        let names = result[0] ? result[0].values.map(row => row[0]) : [];
        names = names.filter(name => name !== null && name !== "");
        
        return names;
    }

    getAll(rowIndex) {
        const result = this.db.exec("SELECT * FROM ALGORITHMS");
        this.db.close();
        
        const algoInfo = {
            id: result[0].values[rowIndex][0], 
            name: result[0].values[rowIndex][1],  
            description: result[0].values[rowIndex][2], 
            code: result[0].values[rowIndex][3], 
            complexity: result[0].values[rowIndex][4]
        };
        
        return algoInfo;
    }
    
    isDbOpen(){
        return this.isOpen;
    }

    closeDb(){
        if(this.db){
            this.db.close();
            this.isOpen = false;
        }
    }
}

export default DB;