
import { useState } from "react";

import { Button, TextField } from "@mui/material";

const Calification = ({voteMovie, id} : {voteMovie: Function, id: string}) => {

    const [rating, setRating] = useState<number | undefined>();

    return (
        <div style={{ display: 'flex', justifyContent: 'space-around', columnGap: '10px'}}>
            <TextField
                type="number" 
                value={rating}
                onChange={(event) => setRating(Number.parseFloat(event.target.value))}
            />
            <Button 
                variant="contained" 
                onClick={() => voteMovie(id, rating)}
                disabled={rating === undefined}
            >
                Votar
            </Button>
        </div>
    )
}

export default Calification;