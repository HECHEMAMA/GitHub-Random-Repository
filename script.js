const selectLanguage = document.getElementById('selectLanguage')
const container = document.getElementById('repository')
const values = document.getElementById('values')
const nameRepo = document.getElementById('title')
const description = document.getElementById('description')
const tecnology = document.getElementById('language')
const star = document.getElementById('stars')
const fork = document.getElementById('fork')
const open_issues = document.getElementById('open_issues')
const button = document.getElementById('button')


function handleState(state) {
    switch (state) {
        case 'refresh':
            handleLanguage()
            break
        case 'retry':
            handleLanguage()
            break
        case 'empty':
            description.style.fontWeight = 'bold'
            nameRepo.textContent = ''
            values.style.display = 'none'
            container.style.borderColor = ' transparent'
            container.style.background = ' #eaeded'
            description.textContent = 'Plase select a language'
            button.style.display = 'none'
            break
        case 'loading':
            description.style.fontWeight = 'bold'
            nameRepo.textContent = ''
            values.style.display = 'none'
            container.style.borderColor = ' transparent'
            container.style.background = ' #eaeded'
            description.textContent = 'Loading, plase wait...'
            break
        case 'success':
            description.style.fontWeight = 'normal'
            values.style.display = 'flex' 
            container.style.borderColor = ' #000'
            container.style.background = ' #fff'
            button.textContent = 'Refresh'
            button.value = 'refresh'
            button.style.display = 'block'
            button.style.background = ' #000'
            button.style.color = ' #fff'
            break
        case 'error':
            description.style.fontWeight = 'bold'
            container.style.borderColor = 'transparent'
            container.style.background = ' #f5b7b1'
            description.textContent = 'Error fetching repositories'
            button.textContent = 'Click to retry'
            button.value = 'retry'
            button.style.display = 'block'
            button.style.background = ' #CD5C5C'
            button.style.color = ' #fdedec'
            break
    }
}


fetch('https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json')
    .then(languages => languages.json())
    .then(language => {
        language.forEach(title => {
            const option = document.createElement('option')
            option.text = title.title
            option.value = title.value
            selectLanguage.appendChild(option)
            // console.log(title)
        })
    })
    .catch(err => {
        const option = document.createElement('option')
        option.text = 'Languages no found.'

        selectLanguage.appendChild(option)
        // new Error(err)
    })

function indexRandom(totalCount) {
    return Math.floor(Math.random() * totalCount)
}

function formatNumber(num) {
    if(num >= 1000){
        return (num / 1000).toFixed(1) + 'k'
    } else {
        return num.toString()
    }
}

function handleRepositories(language) {
    // console.log(language)
    const repositories = fetch(`https://api.github.com/search/repositories?q=language:${language}`)
        .then(reponse => reponse.json())
        .then(data => {
            const { items } = data
            const index = indexRandom(items.length)
            const repository = items[index]
            setTimeout(()=>{
                // console.log(repository[index])
                handleState('success')
                nameRepo.textContent = `${repository.name}`
                description.textContent = `${repository.description}`
                tecnology.textContent = `⚫ ${language}`
                star.textContent = `⭐️ ${repository.watchers}`
                fork.textContent = `🧐 ${repository.forks}`
                open_issues.textContent = `⚠ ${repository.open_issues}`
            },1000) 
        })

        .catch(err => handleState('error'))
}

function handleLanguage() {
    const language = selectLanguage.value
    if (!language) {
        handleState('empty')
        return
    }
    // console.log(language)

    handleState('loading')

    handleRepositories(language)
}

values.style.display = 'none'
handleLanguage('empty')
selectLanguage.addEventListener('change', handleLanguage)


button.addEventListener('click', () => {
    handleState(button.value)
})