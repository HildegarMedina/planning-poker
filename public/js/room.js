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

            socket.on("room:expires", (data) => {
                console.log('room:expires FRONTEND')
                window.Swal.fire({
                    title: 'Room expired',
                    text: data.message,
                    icon: 'error',
                    confirmButtonText: 'Accept',
                
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/";
                    }
                });
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
        graphResult: null,
        changeNameForm: {
            responseError: false,
            error: false,
            loading: false,
        },
        colors: ["rgb(52, 152, 219)", "rgb(46, 204, 113)", "rgb(22, 160, 133)", "rgb(243, 156, 18)", "rgb(231, 76, 60)", "rgb(189, 195, 199)", "rgb(52, 73, 94)", "rgb(149, 165, 166)"],
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
        getBackgroundColors(length) {
            const backgroundColors = [];
            for (let i = 0; i < length; i++) {
                backgroundColors.push(this.colors[i]);
            }
            return backgroundColors;
        },
        generateConfigGraph(room) {
            const result = room.result;
            console.log('result.cardCounts', result.cardCounts)
            const backgroundColors = this.getBackgroundColors(Object.keys(result.cardCounts).length);
            const data = Object.keys(result.cardCounts).map((card) => {
                return result.cardCounts[card];
            });
            const labels = Object.keys(result.cardCounts).map((card) => {
                const percentage = ((result.cardCounts[card] / 20) * 100).toFixed(2);
                return `${card} (${result.cardCounts[card]} votes)  %${percentage}`;
            });
            return { backgroundColors, data, labels };
        },
        destroyGraph() {            
            if (this.graphResult) {
                this.graphResult.destroy();
                this.graphResult = null;
            }
        },
        getDataChart(room) {
            const { backgroundColors, data, labels } = this.generateConfigGraph(room);
            return {
                labels: labels,
                datasets: [
                    {
                        data: data,
                        backgroundColor: backgroundColors,
                        hoverOffset: 4,
                    },
                ],
            }
        },
        getOptionsChart() {
            return {
                responsive: true,
                plugins: {
                    legend: {
                        display: true,
                        fullSize: true,
                        labels: {
                            font: {
                                size: 16,
                                family: "'Roboto', sans-serif",
                            }
                        }
                    }
                },
            }
        },
        createGraph(room) {
            if (this.graphResult) {
                this.destroyGraph(room);
            }
            const ctx = document.getElementById('myChart');
            const chart = new Chart(ctx, {
                type: "pie",
                data: this.getDataChart(room),
                options: this.getOptionsChart()
            });
            this.graphResult = chart;
        }
    }));
});