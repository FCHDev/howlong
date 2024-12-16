function toggleTheme() {
    const html = document.documentElement;
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (html.getAttribute('data-theme') === 'dark') {
        html.removeAttribute('data-theme');
        themeToggle.innerHTML = `<span class="theme-icon">🌙</span> Mode nuit`;
        localStorage.setItem('theme', 'light');
    } else {
        html.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = `<span class="theme-icon">☀️</span> Mode jour`;
        localStorage.setItem('theme', 'dark');
    }
}

function chargerHistorique() {
    const historique = JSON.parse(localStorage.getItem('historiqueCalculs')) || [];
    const container = document.getElementById('listeHistorique');
    container.innerHTML = '';
    
    historique.forEach((item, index) => {
        ajouterItemHistorique(item, index);
    });
}

function ajouterItemHistorique(item, index) {
    const div = document.createElement('div');
    div.className = `item-historique ${item.genre}`;
    const dateMort = new Date(new Date(item.dateNaissance).getTime() + (30000 * 24 * 60 * 60 * 1000));
    const dateNaissance = new Date(item.dateNaissance);
    
    div.innerHTML = `
        <button class="btn-supprimer" onclick="supprimerItem(${index})" title="Supprimer"></button>
        <h3>${item.prenom}</h3>
        <div class="info-historique">
            <span class="icon">📅</span>
            <p>Né(e) le ${dateNaissance.toLocaleDateString()}</p>
        </div>
        <div class="info-historique">
            <span class="icon">⏳</span>
            <p>${item.joursVecus.toLocaleString()} jours sur Terre</p>
        </div>
        <div class="info-historique">
            <span class="icon">⌛</span>
            <p>${item.joursRestants.toLocaleString()} jours restants</p>
        </div>
        <div class="info-historique">
            <span class="icon">†</span>
            <p class="date-mort">Fin de vie estimée : ${dateMort.toLocaleDateString()}</p>
        </div>
    `;
    document.getElementById('listeHistorique').prepend(div);
}

function supprimerItem(index) {
    let historique = JSON.parse(localStorage.getItem('historiqueCalculs')) || [];
    historique.splice(index, 1);
    localStorage.setItem('historiqueCalculs', JSON.stringify(historique));
    chargerHistorique();
}

function calculer() {
    const prenom = document.getElementById('prenom').value;
    const dateNaissance = new Date(document.getElementById('dateNaissance').value);
    const genre = document.querySelector('input[name="genre"]:checked').value;
    const aujourdhui = new Date();
    
    if (!prenom || !dateNaissance) {
        alert('Veuillez remplir tous les champs');
        return;
    }

    // Calcul des jours vécus
    const joursVecus = Math.floor((aujourdhui - dateNaissance) / (1000 * 60 * 60 * 24));
    
    // Calcul des jours restants (sur 30000 jours)
    const joursRestants = Math.max(30000 - joursVecus, 0);
    
    // Calcul du prochain anniversaire
    const prochainAnniversaire = new Date(dateNaissance);
    prochainAnniversaire.setFullYear(aujourdhui.getFullYear());
    if (prochainAnniversaire < aujourdhui) {
        prochainAnniversaire.setFullYear(aujourdhui.getFullYear() + 1);
    }
    const joursJusquAnniversaire = Math.ceil((prochainAnniversaire - aujourdhui) / (1000 * 60 * 60 * 24));
    
    // Calcul de l'âge au prochain anniversaire
    const prochaineAge = prochainAnniversaire.getFullYear() - dateNaissance.getFullYear();

    // Après le calcul des jours restants, ajouter :
    const dateMort = new Date(dateNaissance.getTime() + (30000 * 24 * 60 * 60 * 1000));
    
    // Dans l'affichage des résultats, ajouter :
    document.getElementById('resultats').innerHTML = `
        <h2>Bonjour ${prenom} !</h2>
        <div class="resultat-content">
            <p class="resultat-principal">
                Vous avez vécu <span>${joursVecus.toLocaleString()}</span> jours sur Terre.
                À ce rythme, il vous reste environ <span>${joursRestants.toLocaleString()}</span> jours à vivre.
            </p>
            
            <div class="resultat-details">
                <p>
                    <span class="icon">🎂</span> Votre prochain anniversaire sera dans ${joursJusquAnniversaire} jours.
                    Vous aurez <span class="age">${prochaineAge} ans</span>.
                </p>
                <p class="date-estimation">
                    <span class="icon">📅</span> Si tout va bien, vous devriez être parmi nous jusqu'au ${dateMort.toLocaleDateString()}.
                </p>
            </div>
        </div>
    `;

    document.getElementById('resultats').classList.remove('hidden');

    const resultat = {
        prenom,
        dateNaissance: dateNaissance.toISOString(),
        joursVecus,
        joursRestants,
        genre
    };

    let historique = JSON.parse(localStorage.getItem('historiqueCalculs')) || [];
    historique.push(resultat);
    localStorage.setItem('historiqueCalculs', JSON.stringify(historique));
    
    ajouterItemHistorique(resultat, historique.length - 1);
}

function reset() {
    document.getElementById('prenom').value = '';
    document.getElementById('dateNaissance').value = '';
    document.getElementById('garcon').checked = true;
    document.getElementById('resultats').classList.add('hidden');
    
    // Vider aussi le contenu HTML des résultats
    document.getElementById('resultats').innerHTML = '';
}

// Charger l'historique au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    // Charger l'historique
    chargerHistorique();
    
    // Configurer le thème
    const savedTheme = localStorage.getItem('theme');
    const themeToggle = document.getElementById('toggleTheme');
    
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.innerHTML = `<span class="theme-icon">☀️</span> Mode jour`;
    } else {
        themeToggle.innerHTML = `<span class="theme-icon">🌙</span> Mode nuit`;
    }
    
    themeToggle.addEventListener('click', toggleTheme);
}); 