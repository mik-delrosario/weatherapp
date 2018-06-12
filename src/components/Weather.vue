<template>
	<div v-if="(this.generatedFields.woeid.show)">
		<div v-for="city in cities">
			<h1>{{city.title}}</h1>
			<h3>{{formatDate(city.weather.time)}}</h3>
			<table>
				<tr>
					<th>Weather</th>
					<th>Temperature</th>
					<th>Max Temp.</th>
					<th>Min Temp.</th>
				</tr>
				<tr v-for="weather in city.weather.consolidated_weather">
					<td>{{weather.weather_state_name}}</td>
					<td>{{weather.the_temp}}</td>
					<td>{{weather.max_temp}}</td>
					<td>{{weather.min_temp}}</td>
				</tr>
			</table>
		</div>
	</div>
	<div v-else="" class="weather">
		<span>Search: </span>
		<input type="text" v-on:keyup.enter="goto" v-model="generatedFields.search.value" />
		<button v-on:click="goto" >Search</button>
		<table id="cities">
			<tr>
				<th>City Name</th>
				<th>Weather</th>
			</tr>
			<tr v-for="city in cities">
				<td>{{city.title}}</td>
				<td>
					<table id="inner-weather">
						<tr>
							<th>Weather</th>
							<th>Temperature</th>
							<th>Max Temp.</th>
							<th>Min Temp.</th>
							<th></th>
						</tr>
						<tr  v-for="weather in city.weather.consolidated_weather">
							<td>{{weather.weather_state_name}}</td>
							<td>{{weather.the_temp}}</td>
							<td>{{weather.max_temp}}</td>
							<td>{{weather.min_temp}}</td>
							<td>
								<a :href="$url('/weather/'+city.woeid)">
									<img height="30" width="30" 
								:src= "$url('https://www.metaweather.com/static/img/weather/png/'+weather.weather_state_abbr+'.png')" />
								</a>
							</td>
						</tr>
					</table>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
	export default {
		name: 'weather',
		data () {
			return {
				generatedFields: {
					search:{
						value: "",
						show: false
					},
					woeid:{
						value: "",
						show: false
					}
				},
				cities: [],
			}
		},
		methods: {
			formatDate: function(dateset){
				var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
				var d = new Date(dateset);
				return d.toLocaleDateString("en-US", options);
				//return Date.parse(dateset.substring(0,10));
			},
			goto: function(){
				var s = this.generatedFields.search.value;
				alert('goto: '+s);
				//this.$route.router.go('/weather/'+s);
				location.href = '/search/'+s;
			},
			loadCities: function(city){

				const myReq = new Request('http://localhost/test/weather.php?command=search&keyword='+city);
				fetch(myReq)
		        .then((response) => { return response.json() })
		        .then((data) => {
		        	//console.log(data);
		        	for (var i = 0, len = data.length; i < len; i++) {
		        		var title= data[i].title;
		        		var woeid= data[i].woeid;
						
						this.$http.get('http://localhost/test/weather.php?command=location&woeid='+woeid).then(function(response){
							console.log({
								'title': response.data.title,
								'woeid': response.data.woeid,
								'weather':response.data.consolidated_weather
							});
							this.cities.push({
								'title': response.data.title,
								'woeid': response.data.woeid,
								'weather':response.data
							});
						});
					}
		          // console.log(self.items)
		        }).catch( error => { console.log(error); });
			}
		},
		created: function(){
			console.log(this.$route.params);
			let self = this;
			var defaultCities = ['Istanbul', 'Berlin', 'London', 'Helsinki', 'Dublin', 'Vancouver'];
			if (typeof this.$route.params.woeid !== 'undefined') {
				this.generatedFields.woeid.value = this.$route.params.woeid;
				this.generatedFields.search.value = "";

				this.generatedFields.woeid.show  = true;
				this.generatedFields.search.show = false;

				this.$http.get('http://localhost/test/weather.php?command=location&woeid='+this.$route.params.woeid).then(function(response){
					console.log({
						'title': response.data.title,
						'woeid': response.data.woeid,
						'weather':response.data.consolidated_weather
					});
					this.cities.push({
						'title': response.data.title,
						'woeid': response.data.woeid,
						'weather':response.data
					});
				});
			}else if (typeof this.$route.params.keyword !== 'undefined') {
				this.generatedFields.search.value = this.$route.params.keyword;
				this.generatedFields.woeid.value = "";

				this.generatedFields.woeid.show  = false;
				this.generatedFields.search.show = true;

				self.loadCities(this.$route.params.keyword);
			}else{
				this.generatedFields.search.value = "";
				this.generatedFields.woeid.value = "";

				this.generatedFields.woeid.show  = false;
				this.generatedFields.search.show = false;

				//console.log(defaultCities.length);
				for(var x=0,len=defaultCities.length;x<len;x++){
					self.loadCities(defaultCities[x]);
				}
			}

			
		},
	}
</script>

<style scoped>
	#cities {
	    font-family: "Trebuchet MS", Arial, Helvetica, sans-serif;
	    border-collapse: collapse;
	    width: 100%;
	}

	#cities td, #cities th {
	    border: 1px solid #ddd;
	    padding: 8px;
	}

	#cities tr:nth-child(even){background-color: #f2f2f2;}

	#cities th {
	    padding-top: 12px;
	    padding-bottom: 12px;
	    text-align: left;
	    background-color: #4CAF50;
	    color: white;
	}
</style>