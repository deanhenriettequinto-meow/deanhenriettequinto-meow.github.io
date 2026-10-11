/* ==========================================================
   DEAN<3 PORTFOLIO - MAIN SCRIPT.JS
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. SPARKLY CURSOR TRAIL EFFECT
    initSparklyCursor();

    // 2. MOBILE NAVIGATION TOGGLE
    initMobileNav();

    // 3. PROJECT FILTER TABS
    initProjectFilters();

    // 4. CONTACT FORM HANDLING
    initContactForm();

    // 5. TIC-TAC-TOE MINI-GAME
    initTicTacToe();
});


/* ----------------------------------------------------------
   1. SPARKLY CURSOR
   ---------------------------------------------------------- */
function initSparklyCursor() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cursor-canvas';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const colors = ['#d946ef', '#c084fc', '#f472b6', '#e879f9', '#a855f7', '#ffffff'];

    class Sparkle {
        constructor(x, y, isClickBurst = false) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 4 + 2;
            this.baseSize = this.size;
            
            const angle = isClickBurst ? Math.random() * Math.PI * 2 : Math.random() * Math.PI * 2;
            const speed = isClickBurst ? Math.random() * 6 + 2 : Math.random() * 1.5 + 0.5;
            
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.life = 1;
            this.decay = Math.random() * 0.03 + 0.02;
            this.rotation = Math.random() * Math.PI;
            this.rotSpeed = (Math.random() - 0.5) * 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95;
            this.vy *= 0.95;
            this.life -= this.decay;
            this.rotation += this.rotSpeed;
            this.size = this.baseSize * this.life;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;

            // Draw a 4-point star sparkle shape
            ctx.beginPath();
            ctx.moveTo(0, -this.size * 1.5);
            ctx.quadraticCurveTo(0, 0, this.size * 1.5, 0);
            ctx.quadraticCurveTo(0, 0, 0, this.size * 1.5);
            ctx.quadraticCurveTo(0, 0, -this.size * 1.5, 0);
            ctx.quadraticCurveTo(0, 0, 0, -this.size * 1.5);
            ctx.fill();
            ctx.restore();
        }
    }

    let mouseX = -100;
    let mouseY = -100;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        // Spawn 1-2 sparkles on move
        for (let i = 0; i < 2; i++) {
            particles.push(new Sparkle(mouseX + (Math.random() * 10 - 5), mouseY + (Math.random() * 10 - 5)));
        }
    });

    window.addEventListener('click', (e) => {
        // Burst of 18 sparkles on click
        for (let i = 0; i < 18; i++) {
            particles.push(new Sparkle(e.clientX, e.clientY, true));
        }
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
}


/* ----------------------------------------------------------
   2. MOBILE NAVIGATION
   ---------------------------------------------------------- */
function initMobileNav() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('toggle');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                hamburger.classList.remove('toggle');
            });
        });
    }
}


/* ----------------------------------------------------------
   3. PROJECT FILTER TABS
   ---------------------------------------------------------- */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 300);
                }
            });
        });
    });
}


/* ----------------------------------------------------------
   4. CONTACT FORM HANDLING
   ---------------------------------------------------------- */
function initContactForm() {
    const form = document.getElementById('contactForm');
    const toast = document.getElementById('formToast');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect form input data
            const name = form.querySelector('#name').value;
            const email = form.querySelector('#email').value;
            const phone = form.querySelector('#phone').value;
            const message = form.querySelector('#message').value;

            // Simple validation feedback
            if (!name || !email || !message) {
                showToast('Please fill out all required fields!', '#ef4444');
                return;
            }

            // Simulate successful dispatch
            showToast(`Thank you, ${name}! Your message has been sent successfully.`, '#c084fc');
            form.reset();
        });
    }

    function showToast(message, color) {
        if (!toast) return;
        toast.textContent = message;
        toast.style.borderColor = color;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 4000);
    }
}


/* ----------------------------------------------------------
   5. TIC-TAC-TOE MINI-GAME
   ---------------------------------------------------------- */
function initTicTacToe() {
    const cells = document.querySelectorAll('.ttt-cell');
    const statusText = document.getElementById('tttStatus');
    const resetBtn = document.getElementById('tttReset');
    const modeBtn = document.getElementById('tttMode');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X'; // X is Player, O is Opponent or AI
    let isGameActive = true;
    let vsAI = true; // Default mode is Player vs AI

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]            // diagonals
    ];

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    if (resetBtn) resetBtn.addEventListener('click', resetGame);
    if (modeBtn) {
        modeBtn.addEventListener('click', () => {
            vsAI = !vsAI;
            modeBtn.textContent = vsAI ? 'Mode: vs AI 🤖' : 'Mode: 2 Player 👥';
            resetGame();
        });
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const index = parseInt(clickedCell.getAttribute('data-index'));

        if (board[index] !== '' || !isGameActive) return;

        makeMove(index, currentPlayer);

        if (checkWin(currentPlayer)) {
            statusText.textContent = vsAI && currentPlayer === 'O' ? 'AI Wins! Better luck next time!' : `Player ${currentPlayer} Wins! 🎉`;
            isGameActive = false;
            highlightWinningCombo();
            return;
        }

        if (board.every(cell => cell !== '')) {
            statusText.textContent = "It's a Draw! 🤝";
            isGameActive = false;
            return;
        }

        // Switch turn
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusText.textContent = vsAI && currentPlayer === 'O' ? "AI is thinking..." : `Player ${currentPlayer}'s Turn`;

        // If vs AI and it's O's turn
        if (vsAI && currentPlayer === 'O' && isGameActive) {
            setTimeout(makeAIMove, 450);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player.toLowerCase(), 'taken');
    }

    function makeAIMove() {
        if (!isGameActive) return;
        
        // Find empty spots
        const emptyIndices = board.map((val, idx) => val === '' ? idx : null).filter(val => val !== null);
        if (emptyIndices.length === 0) return;

        // Simple smart AI: Try to win, block player, or pick random
        let moveIndex = findBestMove('O');
        if (moveIndex === null) moveIndex = findBestMove('X'); // Block player
        if (moveIndex === null) moveIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

        makeMove(moveIndex, 'O');

        if (checkWin('O')) {
            statusText.textContent = 'AI Wins! Better luck next time!';
            isGameActive = false;
            highlightWinningCombo();
            return;
        }

        if (board.every(cell => cell !== '')) {
            statusText.textContent = "It's a Draw! 🤝";
            isGameActive = false;
            return;
        }

        currentPlayer = 'X';
        statusText.textContent = "Player X's Turn";
    }

    function findBestMove(player) {
        for (let condition of winningConditions) {
            let [a, b, c] = condition;
            let vals = [board[a], board[b], board[c]];
            if (vals.filter(v => v === player).length === 2 && vals.includes('')) {
                if (board[a] === '') return a;
                if (board[b] === '') return b;
                if (board[c] === '') return c;
            }
        }
        return null;
    }

    function checkWin(player) {
        return winningConditions.some(condition => {
            return condition.every(index => board[index] === player);
        });
    }

    function highlightWinningCombo() {
        winningConditions.forEach(condition => {
            let [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                cells[a].classList.add('winner');
                cells[b].classList.add('winner');
                cells[c].classList.add('winner');
            }
        });
    }

    function resetGame() {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        currentPlayer = 'X';
        statusText.textContent = "Player X's Turn";
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o', 'taken', 'winner');
        });
    }
}