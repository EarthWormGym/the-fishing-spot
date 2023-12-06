import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { currentWeather } from '../model/currentWeather';
import { historicalWeather } from '../model/historicalWeather';
import { throwError, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WeatherTrackingService {

  private currentWeatherDataSubject = new Subject<currentWeather>();
  currentWeatherData$ = this.currentWeatherDataSubject.asObservable();
  private historicalWeatherDataSubject = new Subject<historicalWeather>();
  historicalWeatherData$ = this.historicalWeatherDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCurrentWeather(location: string) {
    return this.http.get<any>(`/api/weather/current?location=${location}`).pipe(
      map((requestData) => this.mapCurrentWeather(requestData)),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return throwError(error);
      })
    ).subscribe((weatherData: currentWeather) => {
      this.currentWeatherDataSubject.next(weatherData);
    });
  };

  getHistoricalWeather() {
    return this.http.get<any>(`/api/weather/historical`).pipe(
      map((requestData) => this.mapHistoricalWeather(requestData)),
      catchError((error) => {
        console.error('Error fetching weather data:', error);
        return throwError(error);
      })
    ).subscribe((weatherData: historicalWeather) => {
      this.historicalWeatherDataSubject.next(weatherData);
    });
  };

  private mapCurrentWeather(requestData: any): currentWeather {
    return {
      weatherId: Math.floor(Math.random() * 10000),
      data: {
        location: {
          name: requestData.location.name,
          region: requestData.location.region,
          country: requestData.location.country
        },
        currentWeather: {
          lastUpdated: requestData.current.last_updated,
          tempC: requestData.current.temp_c,
          windMph: requestData.current.wind_mph,
          precipMm: requestData.current.precip_mm,
          cloudCover: requestData.current.cloud,
          uv: requestData.current.uv
        }
      }
    } as currentWeather;
  }

  private mapHistoricalWeather(requestData: any): historicalWeather {
    return {
      weatherId: Math.floor(Math.random() * 10000),
      data: {
        location: {
          name: requestData.location.name,
          region: requestData.location.region,
          country: requestData.location.country
        },
        historicalWeather: {
          date: requestData.forecast.forecastday[0].date,
          tempC: requestData.forecast.forecastday[0].day.avgtemp_c,
          totalPrecipMm: requestData.forecast.forecastday[0].day.totalprecip_mm,
          uv: requestData.forecast.forecastday[0].day.uv,
          morning: {
            cloudCover: requestData.forecast.forecastday[0].hour[7].cloud,
            precipMm: requestData.forecast.forecastday[0].hour[7].precip_mm,
            windMph: requestData.forecast.forecastday[0].hour[7].wind_mph,
            humidity: requestData.forecast.forecastday[0].hour[7].humidity
          },
          midday: {
            cloudCover: requestData.forecast.forecastday[0].hour[12].cloud,
            precipMm: requestData.forecast.forecastday[0].hour[12].precip_mm,
            windMph: requestData.forecast.forecastday[0].hour[12].wind_mph,
            humidity: requestData.forecast.forecastday[0].hour[12].humidity
          },
          evening: {
            cloudCover: requestData.forecast.forecastday[0].hour[18].cloud,
            precipMm: requestData.forecast.forecastday[0].hour[18].precip_mm,
            windMph: requestData.forecast.forecastday[0].hour[18].wind_mph,
            humidity: requestData.forecast.forecastday[0].hour[18].humidity
          }
        }
      }
    } as historicalWeather;
  }

}
