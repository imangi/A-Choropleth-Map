let countyURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json"
let educationURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json"

let educationData
let countyData

let canvas = d3.select("#canvas");
let tooltip = d3.select("body")
.append("div")
.attr("id", "tooltip")
.style("opacity", "0")



let drawMap = () => {
    canvas.selectAll('path')
            .data(countyData)
            .enter()
            .append('path')
            .attr('d', d3.geoPath())
            .attr('class', 'county')
            .attr('fill', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let precentage = county['bachelorsOrHigher']
                if(precentage <= '15' ){
                    return '#F6BD60'
                }else if(precentage <= 30){
                    return '#F5CAC3'
                }else if( precentage <= 48){
                    return '#84A59D'
                }else{
                    return '#F28482'
                }
            })
            .attr('data-fips', (countyDataItem) => {
                return countyDataItem['id']
            })
            .attr('data-education', (countyDataItem) => {
                let id = countyDataItem['id']
                let county = educationData.find((item) => {
                    return item['fips'] === id
                })
                let precentage = county['bachelorsOrHigher']
                    return precentage
            })
            .on("mouseover", function(event, d) {      
                tooltip.transition()     
                          
                    tooltip.style("opacity", 0.9)
                    tooltip.html(() => {
                        let result = educationData.filter(function (obj) {
                          return obj.fips === d.id;
                        })     
                     if (result[0]) {
                    return (
                      result[0]['area_name'] +
                      ', ' +
                      result[0]['state'] +
                      ': ' +
                      result[0].bachelorsOrHigher +
                      '%'
                    );
                  }
                  // could not find a matching fips id in the data
                  return 0;
                }) 
                .attr('data-education', function () {
                    var result = educationData.filter(function (obj) {
                      return obj.fips === d.id;
                    })
                    if (result[0]) {
                      return result[0].bachelorsOrHigher;
                    }
                    // could not find a matching fips id in the data
                    return 0;
                  })
                  .style('left', event.pageX + 10 + 'px')
                  .style('top', event.pageY - 28 + 'px')
              })
              .on('mouseout', function () {
                tooltip.style('opacity', 0);
              }) 
            
          

          
            

        
            
            
}

d3.json(countyURL).then(
    (data, error) => {
        if(error) {
            console.log(error)
        }else{
            countyData = topojson.feature(data, data.objects.counties).features
            console.log(countyData)

            d3.json(educationURL).then(
                (data, error) => {
                    if(error){
                        console.log(error)
                    }else{
                        educationData = data;
                        console.log(educationData)
                        drawMap();
                    }
                }
            )
    }
} 
)