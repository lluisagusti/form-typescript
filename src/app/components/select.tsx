import React from 'react'
import { Select } from 'semantic-ui-react'


const Selector = ({ selection, options, placeholder }: any) => (
  <Select placeholder={placeholder} options={options} onChange={selection} />
)

export default Selector