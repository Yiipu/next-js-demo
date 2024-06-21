"use client"
import { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { User } from '@nextui-org/user';
import Link from 'next/link';

function FileCard({ file }) {
    const [user, setUser] = useState({
        nickname: '',
        email: '',
        picture: ''
    });

    useEffect(() => {
        async function getUserInfo() {
            const data = await fetch(`/api/users/${file.user_id}`)
                .then(res => res.json())
                .catch(err => console.error(err));
            return data;
        }
        getUserInfo().then(data => setUser(data));
    }, [file.user_id])

    return (
        <Card className=" m-8">
            <CardHeader>
                <User
                    avatarProps={{
                        src: user.picture,
                        alt: user.nickname
                    }}
                    name={user.nickname}
                    description={user.email}
                />
            </CardHeader>
            <CardBody>
                <Link href={`/${file.user_id}/${file.name}?file_id=${file.id}`}>
                    <h3 className=' text-lg underline text-primary'>{file.name.split(".")[0]}</h3>
                </Link>
                {file.description ? <div className=' pt-2'>
                    <p className=' text-sm'>{file.description}</p>
                    <a href="https://learn.microsoft.com/azure/ai-services/language-service/" className='flex items-center pt-1'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18"><defs><linearGradient id="fff5dcaa-48fe-4990-9204-1670ea2377cd" x1="11.841" y1="2.17" x2="11.841" y2="13.446" gradientUnits="userSpaceOnUse"><stop offset="0.001" stop-color="#ffb34d" /><stop offset="1" stop-color="#faa21d" /></linearGradient><linearGradient id="a8e30e54-ca13-4995-915b-e4de999d703b" x1="-2018.213" y1="1017.927" x2="-2018.213" y2="1009.817" gradientTransform="translate(-2013.007 1025.516) rotate(180)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#50e6ff" /><stop offset="1" stop-color="#32bedd" /></linearGradient></defs><g id="adde4e84-76b1-415f-905a-fab09c0b1f16"><g><path d="M.362,3.138A.362.362,0,0,1,0,2.777H0V.361A.362.362,0,0,1,.362,0H2.628a.361.361,0,0,1,0,.722H.724V2.775a.363.363,0,0,1-.361.363ZM18,2.777V.361A.362.362,0,0,0,17.638,0H15.372a.361.361,0,1,0,0,.722h1.9V2.775a.362.362,0,0,0,.724,0ZM2.99,17.639a.361.361,0,0,0-.362-.361H.724V15.225a.362.362,0,0,0-.724,0V17.64A.362.362,0,0,0,.362,18H2.628A.362.362,0,0,0,2.99,17.639Zm15.01,0V15.225a.362.362,0,0,0-.724,0v2.053h-1.9a.361.361,0,1,0,0,.722h2.266A.362.362,0,0,0,18,17.64Z" fill="#faa21d" /><g><g><path d="M16.684,2.666V13.129a.318.318,0,0,1-.3.329H10.628a.281.281,0,0,1-.281-.281V8.266A.945.945,0,0,0,9.415,7.4H7.279A.281.281,0,0,1,7,7.12V2.666a.316.316,0,0,1,.3-.33h9.08A.318.318,0,0,1,16.684,2.666Z" fill="url(#fff5dcaa-48fe-4990-9204-1670ea2377cd)" /><path d="M15.118,6.405h-1.79a.327.327,0,0,1-.285-.356.328.328,0,0,1,.285-.357h1.79a.328.328,0,0,1,.286.357A.327.327,0,0,1,15.118,6.405Z" fill="#f78d1e" /></g><g><path d="M9.414,7.823H1A.53.53,0,0,0,.489,8.3v5.687A.524.524,0,0,0,1,14.463H3.784a.08.08,0,0,1,.081.079V15.5a.191.191,0,0,0,.208.164.181.181,0,0,0,.086-.035l.278-.181.77-.51.7-.466a.11.11,0,0,1,.052-.017H9.414a.509.509,0,0,0,.511-.468V8.3A.523.523,0,0,0,9.414,7.823Z" fill="url(#a8e30e54-ca13-4995-915b-e4de999d703b)" /><path d="M3.3,12.412H1.929c-.158,0-.285-.17-.285-.38s.127-.379.285-.379H3.3c.158,0,.286.17.286.379S3.461,12.412,3.3,12.412Z" fill="#9cebff" /></g></g></g><path d="M12.12,6.405H8.563a.357.357,0,1,1,0-.713H12.12a.357.357,0,1,1,0,.713Zm3.355,1.55a.357.357,0,0,0-.357-.356h-3.4a.357.357,0,1,0,0,.713h3.4A.357.357,0,0,0,15.475,7.955ZM5.843,10.149a.356.356,0,0,0-.357-.356H1.929a.356.356,0,1,0,0,.712H5.486A.356.356,0,0,0,5.843,10.149Zm3,1.906a.357.357,0,0,0-.357-.356H4.512a.357.357,0,1,0,0,.713H8.485A.357.357,0,0,0,8.842,12.055Z" fill="#f2f2f2" /></g></svg>
                        <span className=' text-xs ml-1'>
                            summarized by Azure AI
                        </span>
                    </a>
                </div> : <p className=' text-sm'>No description provided</p>}
            </CardBody>
        </Card>
    )
}

export function FileList() {
    const loader = useRef(null);
    const root = useRef(null);
    const [items, setItems] = useState([]);
    const offset = useRef(0); // Changed from useState to useRef
    const limit = 3;
    const [hasmore, setHasmore] = useState(true);

    const getData = useCallback(async () => {
        const { data } = await fetch(`/api/mdxfiles?offset=${offset.current}&limit=${limit}`)
            .then((res) => res.json())
            .catch((err) => {
                console.error(err);
                return { data: [] };
            });
        if (data.length < limit) {
            setHasmore(false);
        }
        return data;
    }, [limit]); // Removed offset from the dependency array

    const handleObserver = useCallback((entities) => {
        const target = entities[0];
        if (target.intersectionRatio <= 0) return;

        // load more content
        getData().then((data) => setItems((prevItems) => [...prevItems, ...data]));
        offset.current += limit; // Changed from setOffset to offset.current
    }, [getData, limit]); // Added limit to the dependency array

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            root: root.current,
            rootMargin: "0px",
            threshold: [0],
        });
        observer.observe(loader.current);

        return () => observer.disconnect();
    }, [handleObserver]);

    return (
        <div className="overflow-auto h-[calc(100vh-88px)]" ref={root}>
            {items.map((item, index) => (
                <FileCard key={index} file={item} />
            ))}
            {hasmore && <div className="loader m-8 text-center" ref={loader}>
                <h2>More content loading...</h2>
            </div>}
        </div>
    )
}