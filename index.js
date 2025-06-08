function startGame() {
    const name = document.getElementById('name').value.trim();
    if (!name) return alert('Enter a name');
    localStorage.setItem('surviveUser', JSON.stringify({ name, scene: 'start' }));
    window.location.href = 'game.html';
}

window.onload = () => {
    const saved = localStorage.getItem('surviveUser');
    if (saved) {
        // Auto continue to game if already registered
        window.location.href = 'game.html';
    }
};
