export class InnoshipSettings {
    innoshipApiToken: string;
    constructor(){
        this.innoshipApiToken = '';
    }

    setInnoshipApiToken(apiToken: string){
        this.innoshipApiToken = apiToken;
    }

}