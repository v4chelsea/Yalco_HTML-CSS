const controlForm = document.createElement('form')

const eventFunc = (control, field, value) => {
    const elems = document.querySelectorAll(control.obj.query);
    for (let i = 0; i < elems.length; i++) {
        if (field.style) {
            elems[i].style[field.style] = value
        } else if (field.attr) {
            elems[i].setAttribute(field.attr, value)
        }
    }
}

controls.forEach((control, c_idx) => {
    const fieldSet = document.createElement('fieldset')
    const legend = document.createElement('legend')
    legend.innerHTML = control.obj.name
    fieldSet.appendChild(legend)

    control.fields.forEach((field, f_idx) => {

        const controlName = 'control_' + c_idx + '_' + f_idx
        const controlTitle = document.createElement('h6')
        let title = field.style ? field.style : field.attr
        controlTitle.innerHTML = title
        fieldSet.appendChild(controlTitle)

        if (['text', 'number'].includes(field.type)) {
            const input = document.createElement('input')
            input.setAttribute('type', field.type)
            input.classList.add('uk-form-small', 'uk-input')
            input.value = field.default

            input.addEventListener('change', (e) => {
                eventFunc(control, field, e.target.value)
            })

            fieldSet.appendChild(input)
        }

        if (field.type === 'radio') {
            field.opts.forEach((opt, o_idx) => {
                const radioId = 'r_' + c_idx + f_idx + '_' + o_idx
                const radio = document.createElement('input')
                radio.setAttribute('type', field.type)
                radio.setAttribute('name', controlName)
                radio.className = 'uk-radio'
                radio.id = radioId
                radio.value = opt
                if (o_idx === 0) radio.setAttribute('checked', true)

                radio.addEventListener('change', () => {
                    eventFunc(control, field, opt)
                })

                const label = document.createElement('label')
                label.setAttribute('for', radioId)
                label.innerHTML = opt

                fieldSet.appendChild(radio)
                fieldSet.appendChild(label)
            })
        }

        if (field.type === 'select') {
            fieldSet.appendChild(controlTitle)
            const select = document.createElement('select')
            select.className = 'uk-form-small'

            field.opts.forEach((opt, o_idx) => {
                const option = document.createElement('option')
                option.innerHTML = opt
                if (o_idx === 0) option.setAttribute('selected', true)
                option.value = opt

                select.appendChild(option)
            })

            select.addEventListener('change', (e) => {
                eventFunc(control, field, e.target.value)
            })
            fieldSet.appendChild(select)
        }

        if (field.type === 'range') {
            const range = document.createElement('input')
            range.setAttribute('type', field.type)
            range.className = 'uk-range'

            const rangeVal = Number(window.getComputedStyle(document.querySelector(control.obj.query))[field.style].replace(field.unit, ''))
            range.setAttribute('min', 0)
            range.setAttribute('max', rangeVal * 4)
            range.value = rangeVal

            const rangeValue = document.createElement('span')
            rangeValue.innerHTML = `(${rangeVal}${field.unit})`
            controlTitle.appendChild(rangeValue)

            range.addEventListener('change', (e) => {
                const value = `${e.target.value}${field.unit}`
                eventFunc(control, field, value)
                rangeValue.innerHTML = `(${value})`
            })

            fieldSet.appendChild(range)
        }
    })
    controlForm.appendChild(fieldSet)
})
document.querySelector('.controls').append(controlForm)