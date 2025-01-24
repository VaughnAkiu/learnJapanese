import Link from 'next/link'
import utilStyles from '../styles/utils.module.css';
import React, {useEffect, useState} from 'react';
import Card from '../objects/wordCardObject'

export default function chooseKanji() {

    const [data, setData] = useState<Card[]>();
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch('http://localhost:3000/api/kanjiRoute');
          const result = await response.json();
          setData(result.rows); // Assume `result.rows` contains the desired data
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    const doSomething =  () => {
        console.log("checkbox clicked");
    }


    return (
        <>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="flashCards">Flash Cards</Link>
          </li>
          <div className={utilStyles.container}>
        <header>
            <>
              <h2 className={utilStyles.headingLg}>
                  Choose your kanji
              </h2>
              <p>fill in checkboxes and submit to update the main list</p>
            </>
        </header>
      </div>
      <div className={utilStyles.containerChooseKanji}>
        <table>
            <thead>
                <tr>
                    <th>Kanji</th>
                    <th>Pronounciation</th>
                    <th>Translation</th>
                    <th>Learning</th>
                </tr>
            </thead>
            <tbody>
                {loading ? <tr><td>loading data...</td></tr> :
                data.map
                    (
                        (row) => 
                        (
                            <tr key={row.id}>
                                <td>{row.kanji}</td>
                                <td>{row.pronounciation}</td>
                                <td>{row.translation}</td>
                                <td><input type="checkbox" onClick={() => doSomething()}/></td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
        </div>
        <button>submit</button>
        </>
      );
  }