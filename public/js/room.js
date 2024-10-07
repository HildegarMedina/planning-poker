document.addEventListener("alpine:init", () => {
    Alpine.data("room", () => ({
        init() {
            const url = window.location.href;
            const roomId = url.split("/").pop();
            this.roomId = roomId;
            const socket = io();
            this.socket = socket;

            socket.on("room updated", (room) => {
                if (!this.initialized) {
                    const me = room.players.find(p => p.name === this.playerName);
                    this.cardSelected = me.card_selected ? me.card_selected : null;
                    this.me = me;
                    this.initialized = true;
                }
                this.players = room.players.map((v, i) => ({...v, card_selected: v.card_selected ? true : false }))
            });

        },
        initialized: false,
        me: {},
        roomId: null,
        socket: null,
        playerName: null,
        players: [],
        joined: false,
        cards: ['1/2', '1', '3', '5', '8', '13', '21', '34', '55', '80', '?', '☕'],
        cardSelected: null,
        changeNameForm: {
            responseError: false,
            error: false,
            loading: false,
        },
        joinRoom() {
            if (!this.playerName) {
                this.changeNameForm.error = true;
                return;
            }
            this.changeNameForm.loading = true;
            this.socket.emit("join room", this.playerName, this.roomId);
            this.loading = false;
            this.joined = true;
        },
        copyUrl() {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            window.Swal.fire({
                title: 'URL copied!',
                text: "",
                icon: 'success',
                confirmButtonText: 'Accept'
            });
        },
        selectCard(card) {
            if (this.cardSelected === card) {
                this.cardSelected = null;
                this.socket.emit("card selected", this.roomId, this.playerName);
                return;
            }
            this.cardSelected = card;
            this.socket.emit("card selected", this.roomId, this.playerName, card);
        }
    }));
});