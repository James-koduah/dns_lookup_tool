let domain = document.getElementById('domain')
let record_filter_items = document.getElementsByClassName('record_item')
let results = document.getElementById('results')
let domain_name;
let searching = false

for (let tag of record_filter_items){
    tag.addEventListener('click', ()=>{
        let name = tag.innerText.toLowerCase()
        if (name == 'all'){
            for (let key in check_records){
                check_records[key] = false
                for(let items of record_filter_items) items.classList.remove('active')
            }
            check_records['all'] = true
            tag.classList.add('active')
            return
        }else{
            check_records['all'] = false
            document.getElementById('all').classList.remove('active')
        }

        if (check_records[name]){
            check_records[name] = false
            tag.classList.remove('active')
        }else{
            check_records[name] = true
            tag.classList.add('active')
        }
    })
}


let check_records = {
    all: true,
    a: false,
    aaaa: false,
    cname: false,
    txt: false,
    mx: false
}

domain.addEventListener('keydown', (e)=>{
    if (e.key == 'Enter'){
        search_records()
    }
})

function search_records(){
    if (searching) return
    else searching = true
    
    let records_to_search = []
    domain_name = domain.value
    if (!domain_name || domain_name.indexOf('/') > -1 || domain_name.indexOf('.') < 0){  
        searching = false 
        return
    }
    if (check_records.all){
        records_to_search.push('all')
    }else{
        for (let key in check_records){
            if (check_records[key]){
                records_to_search.push(key)
            }
        }
    }

    if (records_to_search.length == 0) {
        records_to_search.push('all');
        document.getElementById('all').classList.add('active')
    }

    fetch('/get_records/', {
        headers: {'Content-type': 'application/json'},
        method: 'POST',
        body: JSON.stringify({
            domain: domain_name,
            records: records_to_search
        })
    })
    .then(res=>{return res.json()})
    .then(json=>{
        searching = false
        display_results(json)
    })
    
}

function display_results(data){
    results.innerHTML = `<h4>Results for: <i>${data.domain.toUpperCase()}</i></h4>`
    for (let key in data.data){
        let result = document.createElement('div')
        result.className = 'result'
        let name = document.createElement('header')
        name.innerHTML = key.toUpperCase()

        result.appendChild(name)
        let body = document.createElement('div')
        body.className = 'result_body'
        result.appendChild(body)
        if (data.data[key].length == 0){
            body.innerHTML = '<p class="no_record">No Record Found</p>'
        }else{
            let header = document.createElement('div')
            header.className = 'result_line result_header'
            header.innerHTML = `<p>Domain Name</p><p>Address/Value</p>`
            body.appendChild(header)
            for (let item of data.data[key]){
                let line = document.createElement('div')
                line.className = 'result_line'
                line.innerHTML = `<p>${data.domain}</p><p>${item}</p>`
                body.appendChild(line)
            }
        }


        results.appendChild(result)
    }
}