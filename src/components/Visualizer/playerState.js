class PlayerState {
    static INACTIVE = "Inactive";
    static PLAYING_FORWARD = "Playing forward";
    static PLAYING_REVERSE = "Playing reverse";
    static PAUSED = "Paused";

    constructor(){
        this.state = PlayerState.INACTIVE;
        this.lastDirection = PlayerState.PLAYING_FORWARD;
    }

    play(){
        this.state = this.lastDirection;
    }

    pause(){
        if(this.state !== PlayerState.PAUSED){
            this.lastDirection = this.state;
            this.state = PlayerState.PAUSED;
        }else{
            this.state = this.lastDirection;
        }
    }

    reverse(){
        this.state = PlayerState.PLAYING_REVERSE;
        this.lastDirection = PlayerState.PLAYING_REVERSE;
    }

    forward(){
        this.state = PlayerState.PLAYING_FORWARD;
        this.lastDirection = PlayerState.PLAYING_FORWARD;
    }

    get(){
        return this.state;
    }
}

export default PlayerState;