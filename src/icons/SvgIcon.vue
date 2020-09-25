<template>
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="name" />
    </svg>
</template>
<script>
import { computed, reactive, ref } from '@vue/composition-api'
export default {
    name: "svgIcon",
    props: {
        iconClass:{
            type: String,
            default: ''
        },
        className:{
            type: String,
            default: ''
        }
    },
    setup(props, {root}) {
        const name = computed(()=> `#icon-${props.iconClass}`)
        const svgClass = computed(()=> {
            if(props.className){
                return `svg-icon ${props.className}`
            } else {
                return `svg-icon`
            }
        })

        return {
            name,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
.svg-icon {
    width: 1em;
    height: 1em;
    fill: currentColor;
}
</style>