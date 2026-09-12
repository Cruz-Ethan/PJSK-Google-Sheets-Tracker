export default function addFunctionToFilter(itemSelectButton, itemSelectList, itemFilterList, allItems, rerenderItems) {
    const itemToListMap = {}
    itemSelectButton.addEventListener('click', () => {
        itemSelectList.classList.toggle('hidden')
    })
    renderItemFilter(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
}

function renderItemFilter(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap) {
    const selectAllItems = getSelectAll(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
    const clearAllItems = getClearAll(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
    itemSelectList.append(selectAllItems, clearAllItems)

    allItems.forEach(item => {
        const itemListItem = document.createElement('li')

        itemToListMap[item.name] = itemListItem

        itemListItem.classList.add("px-3", "py-2", "transition", "duration-100")
        if (itemFilterList.includes(item)) {
            itemListItem.classList.add('bg-emerald-200')
        }
        else {
            itemListItem.classList.add('hover:bg-slate-100')
        }

        itemListItem.innerText = capitalize(item.name)
        itemListItem.addEventListener('click', () => {
            const index = itemFilterList.indexOf(item)
            if (index === -1) {
                itemFilterList.push(item)
            } else {
                itemFilterList.splice(index, 1)
            }

            updateItemList(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
        })
        itemSelectList.append(itemListItem)
    })
}

function getSelectAll(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap) {
    const selectAllItems = document.createElement('li')
    selectAllItems.classList.add(
        'px-3',
        'py-2',
        'transition',
        'duration-100',
        'hover:bg-slate-100'
    )
    selectAllItems.innerText = 'Select all'

    selectAllItems.addEventListener('click', () => {
        itemFilterList.push(...allItems)
        updateItemList(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
    })
    return selectAllItems
}

function getClearAll(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap) {
    const clearAllItems = document.createElement('li')
    clearAllItems.classList.add(
        'px-3',
        'py-2',
        'transition',
        'duration-100',
        'hover:bg-slate-100'
    )
    clearAllItems.innerText = 'Clear'

    clearAllItems.addEventListener('click', () => {
        itemFilterList.length = 0
        updateItemList(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap)
    })
    return clearAllItems
}

function updateItemList(itemSelectList, itemFilterList, allItems, rerenderItems, itemToListMap) {
    allItems.forEach(item => {
        const itemListItem = itemToListMap[item.name]
        itemListItem.classList.remove('bg-emerald-200')
        itemListItem.classList.remove('hover:bg-slate-100')
        
        if (itemFilterList.includes(item)) {
            itemListItem.classList.add('bg-emerald-200')
        } else {
            itemListItem.classList.add('hover:bg-slate-100')
        }
    })
    itemSelectList.classList.toggle('hidden')
    rerenderItems()
}

function capitalize(str) {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1);
}