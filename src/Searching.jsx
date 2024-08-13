import React from 'react'

const Searching = ({ searchQuery, setSearchQuery ,listOfData}) => {
    const handleChange = (e)=>{
      setSearchQuery(e.target.value)
    }
    return (
    <div>
           <select name="cars" id="cars">
     
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