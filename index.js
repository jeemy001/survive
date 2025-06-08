function startGame() {
    const name = document.getElementById('name').value.trim();
    if (!name) return alert('Enter a name');
    const gender = document.getElementById('gender').value;
    const lang = document.getElementById('lang').value;
    const user = {
        name,
        gender,
        lang,
        scene: 'start',
        stats: { money: 10, power: 5, social: 5, hunger: 0 }
    };
    localStorage.setItem('surviveUser', JSON.stringify(user));
    window.location.href = 'game.html';
}

window.onload = () => {
    const saved = localStorage.getItem('surviveUser');
    if (saved) {
        // Auto continue to game if already registered
        window.location.href = 'game.html';
    }
};
