import Head from 'next/head'
import Image from 'next/image'
import Layout from '../components/Layout'
import HomeSlider from '../components/HomeSlider'
import HomeDiet from '../components/HomeDiet'
import HomeIngredients from '../components/HomeIngredients'
import HomeRecipe from '../components/HomeRecipe'
import HomeForm from '../components/HomeForm'
import styles from '../styles/Home.module.scss'

export default function Home() {
  return (
    <Layout>
      <div className='page'>
        <div className={styles.home}>
          <HomeSlider />
          <HomeDiet />
          <HomeIngredients />
          <HomeRecipe />
          <HomeForm />
        </div>
      </div>
    </Layout>
  )
}
