import React from 'react'

import Slider from '../../components/Slider'
import OurDiet from '../../components/Home/OurDiet'
import OurIngredients from '../../components/Home/OurIngredients'
import SlideNutrition from './SlideNutrition'
import SpecialRecipe from './SpecialRecipe'

const homeSlides = [
    {
        id: 'sld_0',
        text: 'slider 0',
        backgroundColor: '#d8e2dc',
        slideComponent: <SlideNutrition />,
    },
    {
        id: 'sld_1',
        text: 'slider 1',
        backgroundColor: '#ffe5d9',
        slideComponent: <div>hola 2</div>
    },
    {
        id: 'sld_2',
        text: 'slider 2',
        backgroundColor: '#fbfaf0',
        slideComponent: <div>hola 3</div>
    },
    {
        id: 'sld_3',
        text: 'slider 3',
        backgroundColor: '#ffe9ee',
        slideComponent: <div>hola 4</div>
    },
    {
        id: 'sld_4',
        text: 'slider 4',
        backgroundColor: '#ffdde4',
        slideComponent: <div>hola 5</div>
    },
]

const Home = () => {
    return (
        <>
            <section >
                <Slider slides={homeSlides} />
            </section>
            <OurDiet />
            <OurIngredients />
            <SpecialRecipe />
        </>
    )
}
 
export default Home