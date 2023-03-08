import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../config/categories'

const Home = () => {
  const categoryImages = {
    default: "https://2.bp.blogspot.com/-Cd5p7_0tFtM/WkKmEef2nsI/AAAAAAAACEg/Bo8yZMz1cksmezXyeYOZMbEJl_t3sm6agCLcBGAs/s1600/cagliari-sony_44.jpg",
    Walls: "https://4.bp.blogspot.com/-hqMoSaKx3C0/WkKeWj4kIuI/AAAAAAAACCc/VO0fqOzQom48D3mC3YXlgIrHPm7kHAuoQCLcBGAs/s1600/ema-nef_2.jpg",
    Paintings: "https://1.bp.blogspot.com/-J3uKLo1s5Wo/WkKYi4JRZeI/AAAAAAAACBI/ysocFuO2iYc8_ZZQF4JjCvCe464w52yRACLcBGAs/s1600/erik%2Bsymphony.jpg",
    Sketchbooks: "https://4.bp.blogspot.com/-PTOCV_cMVbI/WkKYsrOhqZI/AAAAAAAACBU/rBnOC3exJ1YihqgsNC9Dp2f1scMspxuzACEwYBhgL/s1600/prop%2Bpriv.jpg",
    Video: "https://2.bp.blogspot.com/-Cd5p7_0tFtM/WkKmEef2nsI/AAAAAAAACEg/Bo8yZMz1cksmezXyeYOZMbEJl_t3sm6agCLcBGAs/s1600/cagliari-sony_44.jpg",
    Sculptures: "https://4.bp.blogspot.com/-hqMoSaKx3C0/WkKeWj4kIuI/AAAAAAAACCc/VO0fqOzQom48D3mC3YXlgIrHPm7kHAuoQCLcBGAs/s1600/ema-nef_2.jpg",
    Bio: "https://1.bp.blogspot.com/-J3uKLo1s5Wo/WkKYi4JRZeI/AAAAAAAACBI/ysocFuO2iYc8_ZZQF4JjCvCe464w52yRACLcBGAs/s1600/erik%2Bsymphony.jpg",
    Contact: "https://4.bp.blogspot.com/-PTOCV_cMVbI/WkKYsrOhqZI/AAAAAAAACBU/rBnOC3exJ1YihqgsNC9Dp2f1scMspxuzACEwYBhgL/s1600/prop%2Bpriv.jpg"
  }
  const [backgroundImage, setBackgroundImage] = useState(categoryImages.default);
  const categories = CATEGORIES.concat(['Bio', 'Contact'])

  const navElements = categories.map((category, i) => {
    return (
      <li key={i}>
        <Link
          onMouseEnter={() => setBackgroundImage(categoryImages[category])}
          onMouseLeave={() => setBackgroundImage(categoryImages.default)}
          to={`${category}`}>
          <div className="italic">
            {_.capitalize(category)}
          </div>
        </Link>
      </li>
    )
  })

  return (
    <div className="home" style={{ backgroundImage: `url(${backgroundImage})`}}>
      <div className="logo"><Link>EmaJons</Link></div>
      <ul>
        {navElements}
        <li><Link href="/assets/emajons_portfolio.pdf" download="emajons_portfolio">Portfolio</Link></li>
      </ul>
    </div>
  )
}

export default Home
