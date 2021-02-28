import * as React from 'react'
import { IRestuarnt } from './App.types'
import './ExtraInfo.css'

interface IExtrainfoProps {
    data: IRestuarnt
    onClose: (event: React.MouseEvent<HTMLButtonElement>) => void
}

export const ExtraInformation: React.FC<IExtrainfoProps> = (props: IExtrainfoProps) => {
    return (
        <>
            <div className="popup">
                <div className="content">
                    <button className="close" onClick={props.onClose}>X</button>
                        <h3>some yummy info</h3>
                    <p>
                        <b>location</b>
                        <div>
                            <a
                                href={`https://www.google.com/maps/place/${props.data.lat},${ props.data.long}`}
                                target="_blank"
                                rel="noreferrer" 
                            >
                                open in google maps
                            </a>
                        </div>
                    </p>
                    <p>
                        <b>opening timings</b>
                        <div>{props.data.hours.split(";")[0]}</div>
                        <div>{props.data.hours.split(";")[1]}</div>
                    </p>
                    <p>
                        {
                            props.data.tags.split(",").map((tag: string) => {
                                return <span className="hastag">{`#${tag}`}</span>
                            })
                        }
                    </p>
                </div>
            </div>
        </>
    )
}