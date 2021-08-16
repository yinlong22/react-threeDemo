export const renderHelper = (dom) =>{
    const el = document.querySelector('.showDemos')
    if (!el)return
    el.innerHTML = ''
    el.appendChild(dom)
}