import React from 'react'
import './Searching.css'

const Searching = ({ searchQuery, setSearchQuery,listOfData,setSelectedOption,selectedOption,calculateSymbol,setCalculateSymbol}) => {
    const handleChange = (e)=>{
      setSearchQuery(e.target.value)  
    }
    
    const handleOption = (e)=>{
      setSelectedOption(e.target.value)
    }

    const handlesymbol = (e)=>{
      setCalculateSymbol(e.target.value)
    }

    let listOfDataInArray = []
    for (const a in listOfData[0]) {
      listOfDataInArray.push(a)
    }

    const symbols = ['equal to','not equal to','greater than','greater than equal to','lesser than','lesser then equal to'] 
  
    return (
    <div>
           <select id="field" value={selectedOption} onChange={handleOption} style={{padding:'7px',backgroundColor:'white',border:'1px solid #ddd',borderRadius:'4px',marginRight:'5px'}}>
              {listOfDataInArray.map(e => {
                  return <option value={e} style={{textTransform:'capitalize',fontWeight:'lighter',fontFamily:'sans-serif',color:'grey'}}> {e} </option>
              })}
           </select>

           <select id='field' value={calculateSymbol} onChange={handlesymbol} style={{padding:'7px',backgroundColor:'white',border:'1px solid #ddd',borderRadius:'4px',marginRight:'5px'}}>
              {symbols && symbols.map(e => {
                return <option value={e} style={{textTransform:'capitalize',fontWeight:'lighter',fontFamily:'sans-serif',color:'grey'}}> {e} </option>
              })}
           </select>
           
           <input type="search" 
                  name="search" 
                  id="search" 
                  placeholder='search Here'
                  value={searchQuery} 
                  onChange={handleChange} 
                  style={{fontFamily:'monospace',fontWeight:'lighter',background:'url(/images/search.png)',backgroundRepeat:'no-repeat',backgroundSize:'15px',backgroundPosition:'95%'}}
            />
    </div>
  )
}

export default Searching