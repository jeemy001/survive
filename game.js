const scenes = {
    start: {
        text: `You wake up in a dark forest. A path splits north and east.`,
        choices: [
            { label: 'Go north', next: 'north' },
            { label: 'Go east', next: 'east' }
        ]
    },
    north: {
        text: `A hungry wolf blocks your way.`,
        choices: [
            { label: 'Fight', next: 'fight' },
            { label: 'Run', next: 'run' }
        ]
    },
    east: {
        text: `You find a quiet cabin. Inside is food and a bed.`,
        choices: [
            { label: 'Rest', next: 'rest' },
            { label: 'Keep moving', next: 'run' }
        ]
    },
    fight: {
        text: `You defeated the wolf but were badly wounded. You reach a village and recover.`,
        end: 'You survive to see another day!'
    },
    run: {
        text: `You get lost and eventually collapse from exhaustion.`,
        end: 'Your adventure ends here.'
    },
    rest: {
        text: `While resting, you dream of a better life. When you awake, the path is clear.`,
        end: 'A peaceful ending awaits you.'
    }
};

function showScene(id) {
    const scene = scenes[id];
    const user = JSON.parse(localStorage.getItem('surviveUser'));
    if (!scene) return;
    user.scene = id;
    localStorage.setItem('surviveUser', JSON.stringify(user));

    document.getElementById('welcome').textContent = `Welcome, ${user.name}`;
    document.getElementById('text').textContent = scene.text;
    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    if (scene.end) {
        const endP = document.createElement('p');
        endP.textContent = scene.end;
        choicesDiv.appendChild(endP);
        document.getElementById('restart').style.display = 'block';
        return;
    }

    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice.label;
        btn.onclick = () => showScene(choice.next);
        choicesDiv.appendChild(btn);
    });
}

function restart() {
    localStorage.removeItem('surviveUser');
    window.location.href = 'index.html';
}

window.onload = () => {
    const userData = localStorage.getItem('surviveUser');
    if (!userData) {
        window.location.href = 'index.html';
        return;
    }
    const user = JSON.parse(userData);
    showScene(user.scene || 'start');
};
