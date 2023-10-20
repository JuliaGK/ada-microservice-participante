class Participant {
    id?: string;
    idEvento: string;
    idUser: string;

    constructor(idEvento: string, idUser: string) {
        this.idEvento = idEvento;
        this.idUser = idUser;
    }
}

export default Participant;
