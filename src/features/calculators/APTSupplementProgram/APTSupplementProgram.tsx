import React, { useEffect, useState } from 'react'
import "./APTSupplementProgram.scss"
import { Form } from 'react-bootstrap'
import Coaching from "./Coaching"
import KeynoteSpeaker from './KeynoteSpeaker'
import MastermindGroup from './MastermindGroup'
import TrainingSessionhalfday from './TrainingSessionhalfday'
import TrainingSessionhours from './TrainingSessionhours'
import Signin from '../../Pages/Signin/Signin'
const APTSupplementProgram = () => {
  const [firstSelectValue, setFirstSelectValue] = useState('Coaching');
  const handleFirstSelectChange = (e) => {
    setFirstSelectValue(e.target.value);
  };
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [])
  const isToken = localStorage.getItem("UserLoginTokenApt")
  const UserStatus = localStorage.getItem("UserStatus")

  return (<>
    {!isToken && isToken == null ? <Signin /> :
      <div className='APTSupplementProgram'>

        <Form.Select value={firstSelectValue} onChange={handleFirstSelectChange}>
          <option value="Coaching">Coaching</option>
          <option value="KeynoteSpeaker">Keynote Speaker</option>
          <option value="MastermindGroup">Mastermind Group</option>
          <option value="TrainingSessionhalfday">Training Session half day</option>
          <option value="TrainingSessionhours">Training Session (1-2)hours</option>
        </Form.Select>
        <br />
        {firstSelectValue === 'Coaching' ? (
          <Coaching />
        ) : firstSelectValue === 'KeynoteSpeaker' ? (
          UserStatus === "ACTIVATE TRIAL" ? "To access Keynot eSpeaker, please subscribe to our service." :
            <KeynoteSpeaker />
        ) :
          firstSelectValue === 'MastermindGroup' ? (
            UserStatus === "ACTIVATE TRIAL" ? "To access Mastermind Group, please subscribe to our service. " :
            <MastermindGroup />
          ) : firstSelectValue === 'TrainingSessionhalfday' ? (
            UserStatus === "ACTIVATE TRIAL" ? "To access Training Session halfday, please subscribe to our service." :
            <TrainingSessionhalfday />
          )
            : firstSelectValue === 'TrainingSessionhours' ? (
              UserStatus === "ACTIVATE TRIAL" ? "To access Training Session hours, please subscribe to our service." :
              <TrainingSessionhours />
            ) : null
        }

      </div>}
  </>
  )
}
export default APTSupplementProgram
