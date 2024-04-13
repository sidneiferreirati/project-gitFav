export class GithubUser {
    static search(username) {
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint).then(data => data.json()).then(({ login, name, public_repos, followers }) => ({
            login,
            name,
            public_repos,
            followers
        }))
    }
}


export class Favotires {
    constructor(root) {
        this.root = document.querySelector(root)
    }


    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-gitfav:')) || []
        // this.entries = [
        //     {
        //         login: 'maykbrito',
        //         name: "Mayk Brito",
        //         public_repos: "76",
        //         followers: '12000'
        //     },
        //     {
        //         login: 'diego3g',
        //         name: "Diego Fernandes",
        //         public_repos: "76",
        //         followers: '12000'
        //     },
        //     {
        //         login: 'sidneiferreirati',
        //         name: "Sidnei Alves",
        //         public_repos: "150",
        //         followers: '15000'
        //     }
        // ]
    }

    delete(user) {
        const filteredEntries = this.entries.filter((entry) => {
            return user.login !== entry.login
        })
        this.entries = filteredEntries
        this.update()
        this.save()
    }

    save() {
        localStorage.setItem('@github-gitfav:', JSON.stringify(this.entries))
    }

    async add(username) {
        const usertExist = this.entries.find(entry => entry.login === username)

        if (usertExist) {
            return alert('Usuario ja cadastrado')
        }

        try {
            const user = await GithubUser.search(username)
            if (user.login === undefined) {
                throw new Error('Usuário não encontrado')
            }

            this.entries = [user, ...this.entries]
            this.update()
            this.save()
        } catch (error) {

        }
    }
}


export class FavoritesView extends Favotires {
    constructor(root) {
        super(root)
        this.tbody = this.root.querySelector('table tbody')

        this.load()
        this.update()
        this.onadd()
    }


    update() {
        this.removeAllTr()

        // if (this.entries.length === 0) {

        //     this.tbody.classList.add('noFavorites')



        // }

        this.entries.forEach(user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user-info strong').textContent = user.name
            row.querySelector('.user-info span').textContent = `/${user.login}`
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').addEventListener('click', () => {
                this.delete(user)
            })
            this.tbody.append(row)
        })

    }


    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach(tr => {
            tr.remove()
        });
    }

    createRow() {
        const tr = document.createElement('tr')
        const content = `
             <td class="user">
                        <img src="" alt="">
                        <div class="user-info">
                            <strong>a</strong>
                            <span></span>
                        </div>
                    </td>
                    <td class="repositories">123</td>
                    <td class="followers">1234</td>
                    <td class="remove">Remover</td>
        `
        tr.innerHTML = content
        return tr
    }

    onadd() {
        const addBtn = this.root.querySelector('.search button')
        addBtn.addEventListener('click', () => {
            const { value } = this.root.querySelector('.search input')
            this.add(value)

        })
    }

    // noFavotire() {


    //     const pathImage = './assets/estrela.svg'
    //     const img = document.createElement('img')
    //     img.classList.add('noFavorites-img')
    //     img.src = pathImage



    //     return img
    // }
}