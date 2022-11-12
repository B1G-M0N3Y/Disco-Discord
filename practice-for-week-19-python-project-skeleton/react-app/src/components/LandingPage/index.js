import ServerCard from './ServerCard'
import './LandingPage.css'

const LandingPage = () => {
    return(
        <>
            <div className='landing-page'>
                <h1>Welcome to the party!</h1>
                <h3>Explore our open clubs:</h3>
                {/* displays a grid of available public servers */}
                <div className='server-card-container'>
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                    <ServerCard />
                </div>
            </div>
        </>
    )
}

export default LandingPage
