"use client"
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useRouter } from 'next/navigation';
import { useUser } from "@auth0/nextjs-auth0/client";

export function FileDropZone() {
    const [isPublic, setIsPublic] = React.useState(false);
    const router = useRouter();
    const { user, error, isLoading } = useUser();
    const userID = user?.sub.split("|")[1];

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        const formdata = new FormData();
        formdata.append("file", file);
        formdata.append("isPublic", isPublic);
        const res = await fetch(`/api/mdxfiles?is_public=${isPublic}`, {
            method: "POST",
            body: formdata,
        });
        const resBody = await res.json();
        if (res.status === 201) {
            router.push(`/${userID}/${resBody.fileName}`);
            return;
        }
    }, [isPublic, router, userID]);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        user && <div className="h-full">
            <input type="checkbox" checked={isPublic} onChange={() => setIsPublic(!isPublic)} /> make_public
            <div {...getRootProps()} className="h-72">
                <input {...getInputProps()} />
                <div className="h-full flex justify-center items-center">
                    {isDragActive ? (
                        <p>drop_zone_drag_active</p>
                    ) : (
                        <p>drop_zone</p>
                    )}
                </div>
            </div>
        </div>
    );
};
