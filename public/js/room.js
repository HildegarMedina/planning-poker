document.addEventListener("alpine:init", () => {
    Alpine.data("room", () => ({
        init() {
            const url = window.location.href;
            const roomId = url.split("/").pop();
            this.roomId = roomId;
            const socket = io();
            this.socket = socket;

            socket.on("room updated", (room) => {
                this.players = room.players;
            });

            this.avatarIndex = Array.from({ length: 14 }, (_, i) => i + 1);
            this.avatarIndex = this.avatarIndex.sort(() => Math.random() - 0.5);

        },
        avatarIndex: [],
        roomId: null,
        socket: null,
        playerName: null,
        players: [],
        joined: false,
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
    }));
});