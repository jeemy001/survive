const translations = {
    tr: {
        start_text: 'Karanlık bir ormanda uyanıyorsun. Kuzey ve doğu yönünde yollar var.',
        start_choice_north: 'Kuzeye git',
        start_choice_east: 'Doğuya git',
        north_text: 'Aç bir kurt yolunu kesiyor.',
        north_choice_fight: 'Savaş',
        north_choice_run: 'Kaç',
        east_text: 'Sessiz bir kulübe buluyorsun. İçeride yiyecek ve yatak var.',
        east_choice_rest: 'Dinlen',
        east_choice_keep_moving: 'Yola devam et',
        fight_text: 'Kurdu yendin ama ağır yaralandın. Bir köye ulaşıp iyileştin.',
        fight_end: 'Bir başka günü görmeyi başardın!',
        run_text: 'Kayboldun ve yorgunluktan yere yığıldın.',
        run_end: 'Maceran burada son buldu.',
        rest_text: 'Dinlenirken daha iyi bir yaşam hayal ediyorsun. Uyandığında yol açık.',
        rest_end: 'Huzurlu bir son seni bekliyor.',
        stat_money: 'Para',
        stat_power: 'Güç',
        stat_social: 'Sosyal Çevre',
        stat_hunger: 'Açlık',
        welcome: 'Hoş geldin, {name}'
    },
    en: {
        start_text: 'You wake up in a dark forest. A path splits north and east.',
        start_choice_north: 'Go north',
        start_choice_east: 'Go east',
        north_text: 'A hungry wolf blocks your way.',
        north_choice_fight: 'Fight',
        north_choice_run: 'Run',
        east_text: 'You find a quiet cabin. Inside is food and a bed.',
        east_choice_rest: 'Rest',
        east_choice_keep_moving: 'Keep moving',
        fight_text: 'You defeated the wolf but were badly wounded. You reach a village and recover.',
        fight_end: 'You survive to see another day!',
        run_text: 'You get lost and eventually collapse from exhaustion.',
        run_end: 'Your adventure ends here.',
        rest_text: 'While resting, you dream of a better life. When you awake, the path is clear.',
        rest_end: 'A peaceful ending awaits you.',
        stat_money: 'Money',
        stat_power: 'Power',
        stat_social: 'Social Circle',
        stat_hunger: 'Hunger',
        welcome: 'Welcome, {name}'
    }
};

function t(lang, key) {
    return translations[lang][key] || translations['tr'][key] || key;
}

const scenes = {
    start: {
        text: 'start_text',
        img: '🌲',
        choices: [
            { label: 'start_choice_north', next: 'north', effects: { hunger: 1 } },
            { label: 'start_choice_east', next: 'east' }
        ]
    },
    north: {
        text: 'north_text',
        img: '🐺',
        choices: [
            { label: 'north_choice_fight', next: 'fight', effects: { power: -2, hunger: 2 } },
            { label: 'north_choice_run', next: 'run', effects: { hunger: 3 } }
        ]
    },
    east: {
        text: 'east_text',
        img: '🏠',
        choices: [
            { label: 'east_choice_rest', next: 'rest', effects: { hunger: -3, social: 1 } },
            { label: 'east_choice_keep_moving', next: 'run', effects: { hunger: 2 } }
        ]
    },
    fight: {
        text: 'fight_text',
        img: '⚔️',
        end: 'fight_end'
    },
    run: {
        text: 'run_text',
        img: '🏃',
        end: 'run_end'
    },
    rest: {
        text: 'rest_text',
        img: '🛏️',
        end: 'rest_end'
    }
};

function showScene(id) {
    const user = JSON.parse(localStorage.getItem('surviveUser'));
    const lang = user.lang || 'tr';
    const scene = scenes[id];
    if (!scene) return;
    user.scene = id;
    localStorage.setItem('surviveUser', JSON.stringify(user));

    document.getElementById('welcome').textContent = t(lang, 'welcome').replace('{name}', user.name);
    document.getElementById('text').textContent = t(lang, scene.text);
    document.getElementById('image').textContent = scene.img || '';

    const statsDiv = document.getElementById('stats');
    statsDiv.innerHTML =
        `<span>${t(lang, 'stat_money')}: ${user.stats.money}</span>` +
        `<span>${t(lang, 'stat_power')}: ${user.stats.power}</span>` +
        `<span>${t(lang, 'stat_social')}: ${user.stats.social}</span>` +
        `<span>${t(lang, 'stat_hunger')}: ${user.stats.hunger}</span>`;

    const choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';

    if (scene.end) {
        const endP = document.createElement('p');
        endP.textContent = t(lang, scene.end);
        choicesDiv.appendChild(endP);
        document.getElementById('restart').style.display = 'block';
        return;
    }

    scene.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = t(lang, choice.label);
        btn.onclick = () => {
            if (choice.effects) {
                for (const k in choice.effects) {
                    user.stats[k] += choice.effects[k];
                    if (user.stats[k] < 0) user.stats[k] = 0;
                }
                localStorage.setItem('surviveUser', JSON.stringify(user));
            }
            showScene(choice.next);
        };
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
    document.documentElement.lang = user.lang || 'tr';
    showScene(user.scene || 'start');
};
