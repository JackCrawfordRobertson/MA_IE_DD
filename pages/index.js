import React, {useEffect, useState} from "react";
import Head from "next/head";
import Image from "next/image";
import Typewriter from "typewriter-effect";
import CountdownTimer from "../src/components/CountdownTimer";


import homeStyles from "../styles/Home.module.css";
import logo from "../public/logo.svg";

export default function Home() {
    const [ nextUpdate, setNextUpdate ] = useState(null);
    const [ stories, setStories ] = useState([]); // Added state for stories

    // Fetch next update time and stories
    useEffect(() => {
        // Function to fetch next update time
        const fetchNextUpdate = () => {
            fetch("/api/next-update")
            .then((response) => response.json())
            .then((data) => {
                setNextUpdate(data.nextUpdate);
            })
            .catch((error) => {
                console.error("Error fetching next update:", error);
            });
        };

        // Function to fetch stories
        const fetchStories = () => {
            fetch("/.netlify/functions/fetchStories")
            .then((response) => response.json())
            .then((data) => {
                setStories(data.stories); // Update state with fetched stories
            })
            .catch((error) => {
                console.error("Error fetching stories:", error);
            });
        };

        fetchNextUpdate();
        fetchStories(); // Initial fetch of stories

        const intervalId = setInterval(fetchStories, 60000); // Re-fetch stories every 60 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, []);

    return (
        <div className="App">
            <Head>
                <title>The Filtered Chronicle</title>
                <meta name="description" content="AI-driven commentary on climate change" />
                <link rel="icon" href="/logo.svg" />
            </Head>

            <header className="App-header">
                <h1
                    style={{
                        fontFamily: "Old English Text MT",
                        marginTop: "0",
                        color: "#333333",
                        fontSize: "48px", // Adjust this value as needed to make the title bigger
                        textAlign: "center", // This will center the text
                    }}
                >
                    The Filtered Chronicle <Image src={logo} alt="Logo" width={30} height={30} />
                </h1>

                <p className="responsive-paragraph">
                    Explore our AI-powered commentary on climate change. Every 10 minutes, we scour headlines from
                    Western media outlets for the latest updates on climate change. These headlines are then fed into a
                    sophisticated language model, which crafts stories in the style of Western news agencies. Can you
                    discern the difference?
                </p>
                {nextUpdate && <CountdownTimer nextUpdate={nextUpdate} />}
            </header>
            <div className="App-sub">
                <div className="App-body">
                    <main className={homeStyles.main}>
                        {stories.map((story, index) => (
                            <article key={index} className={homeStyles.story}>
                                <h2 className={homeStyles.storyH2}>
                                    {index === 0 ? (
                                        <Typewriter
                                            options={{
                                                strings: [ story.headline ],
                                                autoStart: true,
                                                loop: true,
                                            }}
                                        />
                                    ) : (
                                        story.headline
                                    )}
                                </h2>
                                <div className={homeStyles.timestamp}>{story.createdAt}</div>
                                {index === 0 ? (
                                    <Typewriter
                                        options={{
                                            strings: [ story.content ],
                                            autoStart: true,
                                            loop: true,
                                        }}
                                    />
                                ) : (
                                    <p className={homeStyles.storyP}>{story.content}</p>
                                )}
                            </article>
                        ))}
                    </main>
                </div>
            </div>
        </div>
    );
}
