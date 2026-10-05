/* ==========================================================================
   Projects & GitHub Integration Script
   Handles filtering, search, GitHub repo sync, and detail modal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initProjectSearch();
    fetchGitHubRepositories('bhavyaroseaugustin'); // GitHub username configured for auto-fetching
});

// --------------------------------------------------------------------------
// 1. Modal Dialog Logic
// --------------------------------------------------------------------------
function openProjectModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal(modalId) {
    const modal = document.getElementById(`${modalId}-modal`);
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal when clicking on backdrop
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal-backdrop')) {
        event.target.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
});

// Close modal on ESC key
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const activeModals = document.querySelectorAll('.modal-backdrop.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = 'auto';
    }
});

// --------------------------------------------------------------------------
// 2. Project Search & Filter
// --------------------------------------------------------------------------
function initProjectSearch() {
    const searchInput = document.getElementById('project-search');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const projectCards = document.querySelectorAll('.project-card');

        projectCards.forEach(card => {
            const title = card.querySelector('h4') ? card.querySelector('h4').textContent.toLowerCase() : '';
            const desc = card.querySelector('.project-card-desc') ? card.querySelector('.project-card-desc').textContent.toLowerCase() : '';
            const techPills = Array.from(card.querySelectorAll('.tech-pill')).map(pill => pill.textContent.toLowerCase()).join(' ');

            if (title.includes(query) || desc.includes(query) || techPills.includes(query)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// --------------------------------------------------------------------------
// 3. Dynamic GitHub Repository Sync
// --------------------------------------------------------------------------
async function fetchGitHubRepositories(username) {
    const syncStatus = document.getElementById('github-sync-status');
    const projectsGrid = document.getElementById('projects-grid');

    if (!syncStatus || !projectsGrid) return;

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);

        if (!response.ok) {
            // If API rate limited or user has no public repos yet, keep clean default project cards
            syncStatus.innerHTML = `<i class="fa-brands fa-github"></i> <span>GitHub Repositories Displayed</span>`;
            return;
        }

        const repos = await response.json();

        if (Array.isArray(repos) && repos.length > 0) {
            // Filter non-forked public repos
            const validRepos = repos.filter(repo => !repo.fork);

            if (validRepos.length > 0) {
                syncStatus.innerHTML = `<i class="fa-solid fa-check"></i> <span>Synced ${validRepos.length} Repositories from GitHub</span>`;

                // Append newly fetched repos to existing grid if not already present
                validRepos.forEach(repo => {
                    const repoExists = document.getElementById(`repo-${repo.id}`);
                    if (!repoExists) {
                        const repoCard = createRepoCard(repo);
                        projectsGrid.appendChild(repoCard);
                    }
                });
            }
        } else {
            syncStatus.innerHTML = `<i class="fa-brands fa-github"></i> <span>Default Projects Displayed</span>`;
        }
    } catch (error) {
        console.log('GitHub sync notice:', error);
        syncStatus.innerHTML = `<i class="fa-brands fa-github"></i> <span>Projects Ready</span>`;
    }
}

// Helper to create dynamic HTML card for fetched GitHub repo
function createRepoCard(repo) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.id = `repo-${repo.id}`;

    const description = repo.description || 'Public GitHub repository focusing on AI, data science, or web development algorithms.';
    const language = repo.language || 'Python';

    card.innerHTML = `
        <div class="project-card-header">
            <span class="project-icon-box pink-box"><i class="fa-brands fa-github"></i></span>
            <div class="project-card-title-group">
                <h4>${escapeHTML(repo.name)}</h4>
                <span class="repo-visibility">GitHub Public Repo • ⭐ ${repo.stargazers_count}</span>
            </div>
        </div>
        <p class="project-card-desc">${escapeHTML(description)}</p>
        <div class="tech-pills">
            <span class="tech-pill">${escapeHTML(language)}</span>
            <span class="tech-pill">Git</span>
        </div>
        <div class="project-card-footer">
            <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="link-btn">
                <i class="fa-brands fa-github"></i> View Repo <i class="fa-solid fa-arrow-up-right-from-square small-icon"></i>
            </a>
        </div>
    `;

    return card;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}
