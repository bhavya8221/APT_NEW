import React, { useState } from 'react';
import { Form, Row } from 'react-bootstrap';
const TrainingSessionhalfday = () => {
  const [people, setPeople] = useState('');
  const levelsData = {
    '20': { people: "Up to 20 people", amount: " $2500 - $3500 " },
    '30': { people: "Up to 30 people", amount: " $3500 - $4500" },
    '50': { people: "Up to 50 people", amount: " $4600 - $5500" },
    '75': { people: "Up to 75 people", amount: " $5600 - $10500" },
  };
  const amount = people ? levelsData[people]?.amount : '';
  const peopleupto = people ? levelsData[people]?.people : '';
  return (
    <div className="TrainingSessionhalfday">
      <h5>Training Session half-day</h5>
      <Row >
        <Form.Group className='mb-2'>
          <Form.Label>Question:</Form.Label>
          <Form.Select >
            <option value="">select question---</option>
            <option value="How much should I charge a TrainingSessionhalfday client">I have been asked to facilitate a training session, what should I charge??</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className='mb-2' >
          <Form.Label>How many people will be in the session?: </Form.Label>
          <Form.Select value={people} onChange={(e) => setPeople(e.target.value)}>
            <option value="">Select People</option>
            <option value="20">20</option>
            <option value="30">30</option>
            <option value="50">50</option>
            <option value="75">75</option>
            {/* {Object.keys(levelsData).map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))} */}
          </Form.Select>
        </Form.Group>
        <div className='Row_1'>
          <div className='Col_1 blank_input'>
            People :
            <div className='Col_12 blank_input'>
              {peopleupto}
            </div>
          </div>
        </div>
        <div className='Row_1'>
          <div className='Col_1 blank_input'>
            Fee :
            <div className='Col_12 blank_input'>
              {amount}
            </div>
          </div>
        </div>
      </Row>
    </div>
  );
};
export default TrainingSessionhalfday;
