class Participant {
    id?: string;
    idEvent: string;
    idUser: string;

    constructor(idEvent: string, idUser: string) {
        this.idEvent = idEvent;
        this.idUser = idUser;
    }
}

export default Participant;
