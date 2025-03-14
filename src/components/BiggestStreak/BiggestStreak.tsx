import { ReadingsStatus } from '../../pages/User/App';
import './BiggestStreak.css';


interface Props {
    readingsStatus: ReadingsStatus;
};



const BiggestStreak: React.FC<Props> = ({readingsStatus}) =>
{


    return (
        <>
        <section className="biggest_streak">

            <div className='circle-total-streak'>

                <span className='span-biggest_streak'>
                    {readingsStatus?.biggest_streak}
                </span>

            </div>
            <p className='title-biggest_streak'>Maior Ofensiva Obtida!</p>
        </section>
        </>
    )
}


export default BiggestStreak