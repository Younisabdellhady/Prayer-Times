import { useEffect, useState } from "react"
import Prayer from "./componant/Prayer"

function App() {
  const [prayerTimes, setPrayerTimes] = useState(null)
  const [dateTime, setDateTime] = useState("")
  const [city, setCity] = useState("Palestine")

  const cities = [
    { name: "فلسطين", value: "Palestine" },
    { name: "مصر - القاهرة", value: "Egypt" },
    { name: "الأردن - عمّان", value: "Jordan" },
    { name: "سوريا - دمشق", value: "Syria" },
    { name: "لبنان - بيروت", value: "Lebanon" }
  ]

  useEffect(() => {
    const fetchPrayerTimes = async () => {
      try {
        const response = await fetch(`https://api.aladhan.com/v1/timingsByCity?country=${city}&city=${city}`)
        const data_Prayer = await response.json()

        if (data_Prayer && data_Prayer.data) {
          setPrayerTimes(data_Prayer.data.timings)
          setDateTime(data_Prayer.data.date.gregorian.date)
        }
      } catch (error) {
        console.error(error)
      }
    }

    fetchPrayerTimes()
  }, [city])

  const formatTimes = (time) => {
    if (!time) {
      return "00:00";
    }
    let [hours, minutes] = time.split(":").map(Number);
    const perd = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes} ${perd}`;
  }

  return (
    <>
      <section>
        <div className="container">
          <div className="top_sec">
            <div className="city">
              <h3>المدينة</h3>
              <select onChange={(e) => setCity(e.target.value)}>
                {cities.map((city_Obj) => (
                  <option key={city_Obj.value} value={city_Obj.value}>
                    {city_Obj.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="date">
              <h3>التاريخ</h3>
              <h4>{dateTime}</h4>
            </div>
          </div>

          {!prayerTimes ? (
            <p>جاري تحميل مواقيت الصلاة...</p>
          ) : (
            <>
              <Prayer name="الفجر" time={formatTimes(prayerTimes.Fajr)} />
              <Prayer name="الظهر" time={formatTimes(prayerTimes.Dhuhr)} />
              <Prayer name="العصر" time={formatTimes(prayerTimes.Asr)} />
              <Prayer name="المغرب" time={formatTimes(prayerTimes.Maghrib)} />
              <Prayer name="العشاء" time={formatTimes(prayerTimes.Isha)} />
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default App