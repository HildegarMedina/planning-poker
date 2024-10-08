document.addEventListener("alpine:init", () => {
    Alpine.data("room", () => ({
        init() {
            const socket = io();
            const url = window.location.href;
            const roomId = url.split("/").pop();
            this.roomId = roomId;
            this.socket = socket;

            socket.on("room:updated", (room) => {
                const roomData = room;
                const me = roomData.players.find(p => p.name === this.playerName);
                if (me.card_selected != this.cardSelected) {
                    this.cardSelected = roomData.card_selected;
                }
                this.me = me;
                if (roomData.result) {
                    this.createGraph(roomData);
                }else {
                    roomData.players = roomData.players.map((v, i) => ({...v, card_selected: v.card_selected ? true : false }))
                }
                this.room = roomData;
            });

            socket.on("room:cards-flipped", (room) => {
                this.room = room;
                this.createGraph(room);
            });

        },
        me: {},
        roomId: null,
        room: {},
        socket: null,
        playerName: null,
        joined: false,
        cards: ['1/2', '1', '2', '3', '5', '8', '13', '21', '34', '55', '?', '☕'],
        cardSelected: null,
        graphCreated: false,
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
            this.socket.emit("room:join", this.playerName, this.roomId);
            this.loading = false;
            this.joined = true;
        },
        resetRoom() {
            this.room.result = null;
            this.socket.emit("room:reset", this.roomId);
            this.graphCreated = false;
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
                this.socket.emit("player:card-selected", this.roomId, this.playerName);
                return;
            }
            this.cardSelected = card;
            this.socket.emit("player:card-selected", this.roomId, this.playerName, card);
        },
        flipCard() {
            this.socket.emit("room:flip-cards", this.roomId);
        },
        generateVividColor() {
            const getRandomValue = () => Math.floor(Math.random() * 156) + 100;
        
            let r = getRandomValue();
            let g = getRandomValue();
            let b = getRandomValue();
        
            const isMutedColor = (r, g, b) => {
                const max = Math.max(r, g, b);
                const min = Math.min(r, g, b);
                return (max - min) < 50;
            };
        
            while (isMutedColor(r, g, b)) {
                r = getRandomValue();
                g = getRandomValue();
                b = getRandomValue();
            }

            return `rgb(${r}, ${g}, ${b})`;
        },
        createGraph(room) {
            if (this.graphCreated) {
                return;
            }
            const result = room.result;
            const backgroundColors = Object.keys(result.cardCounts).map((card) => {
                return this.generateVividColor();
            });
            const data = Object.keys(result.cardCounts).map((card) => {
                return result.cardCounts[card];
            });
            const labels = Object.keys(result.cardCounts).map((card) => {
                const percentage = ((result.cardCounts[card] / 20) * 100).toFixed(2);
                return `${card} (${result.cardCounts[card]} votes)  %${percentage}`;
            });
            const ctx = document.getElementById('myChart');
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: labels,
                    datasets: [
                        {
                            data: data,
                            backgroundColor: backgroundColors,
                            hoverOffset: 4,
                        },
                    ],
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            labels: {
                                font: {
                                    size: 16,
                                    family: "'Roboto', sans-serif",
                                }
                            }
                        }
                    },
                }
            });
            this.graphCreated = true;
        }
    }));
});