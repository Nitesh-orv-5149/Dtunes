const express = require("express");
const router = express.Router();
const User = require("../models/user");

router.post('/liked', async (req, res) => {
    try {
        const { isLiked, id, userId } = req.body;
        const user = await User.findById(userId);
        if (!user.likedSongs) {
            user.likedSongs = [];
        }
        if (isLiked && !user.likedSongs.includes(id)) {
            user.likedSongs.push(id);
        } else if (!isLiked && user.likedSongs.includes(id)) {
            user.likedSongs = user.likedSongs.filter(songId => songId !== id);
        }
        
        await user.save();
        res.status(200).json({ message: 'Liked songs updated successfully', likedSongs: user.likedSongs });
    } catch (error) {
        console.error('Error updating liked songs:', error);
        res.status(500).json({ message: 'Error updating liked songs', error: error.message });
    }
})

router.get('/liked', async (req, res) => {
    try {
        const { id, userId } = req.query;
        
        const user = await User.findById(userId);
        if (!user.likedSongs) {
            user.likedSongs = [];
        }
        const isLiked = user.likedSongs.includes(id);
        await user.save();
        res.status(200).json({ isLiked });
        

        // if (songId) {
        //     // Return liked status for a specific song
        //     const isLiked = user.likedSongs.includes(songId);
        //     return res.status(200).json({ isLiked });
        // }
        
        // // Return all liked songs if no specific song is requested
        // res.status(200).json({ likedSongs: user.likedSongs });
    } catch (error) {
        console.error('Error getting liked songs:', error);
        res.status(500).json({ message: 'Error getting liked songs', error: error.message });
    }
})

router.get('/favplaylist', async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findById(userId);
        if (!user) {
            console.log('user not found')
        }
        res.status(200).json({ likedSongs: user.likedSongs });
    } catch (error) {
        console.error('Error getting liked songs:', error);
        res.status(500).json({ message: 'Error getting liked songs', error: error.message });
    }
})

router.get('/allplaylists', async (req, res) => {
    try {
        const { userId } = req.query;
        const user = await User.findById(userId);
        if (!user) {
             return res.status(400).json({ error: "User ID is required" });
        }
        res.status(200).json({ playlists: user.playlists });
    } catch (error) {
        console.error('Error getting playlists :', error);
        res.status(500).json({ message: 'Error getting playlists', error: error.message });
    }
})

router.post('/createplaylist', async (req, res) => {
    try {
        const { playlistName, userId } = req.body;
        const user = await User.findById(userId);
        if (!user.playlists) {
            user.playlists = [];
        }
        user.playlists.push({name: playlistName, songs: []});
        await user.save();
        console.log(user.playlists);
        res.status(200).json({ message: 'Playlist created successfully', playlists: user.playlists });
    } catch (error) {
        console.error('Error creating playlist :', error);
        res.status(500).json({ message: 'Error creating playlist', error: error.message });
    }
})

router.get('/playlist/name', async (req, res) => {
    try {
        const { name, userId } = req.query;
        const playlistName = name;
        const user = await User.findById(userId);
        if (!user) {
            console.log("User not found");
        }
        const playlist = user.playlists.find(p => p.name === playlistName.name);
        // console.log(playlist);
        // console.log(playlist.songs);
        res.status(200).json({ playlist, playlistName });
    } catch (error) {
        console.error('Error getting playlist :', error);
        res.status(500).json({ message: 'Error getting playlist', error: error.message });
    }
})

router.get('/:playlistname/songs', async (req, res) => {
    try {
        const { playlistname } = req.params;
        const { userId } = req.query;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const playlist = user.playlists.find(pl => pl.name === playlistname);
        if (!playlist) return res.status(404).json({ message: "Playlist not found" });

        res.status(200).json({ songs: playlist.songs });
    } catch (error) {
        console.error('Error getting songs :', error);
        res.status(500).json({ message: 'Error getting playlist', error: error.message });
    }
})

router.post('/:songname/:playlistname', async (req, res) => {
    try {
        const { songname, playlistname } = req.params;
        const { userId } = req.body;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

         // Find the user and update the matching playlist
         const updatedUser = await User.findOneAndUpdate(
            { _id: userId, "playlists.name": playlistname }, // Find the correct user and playlist
            { $push: { "playlists.$.songs": songname } }, // Push song into the songs array
            { new: true } // Return updated document
        );

        if (!updatedUser) {
            return res.status(404).json({ });
        }

        res.json({ user: updatedUser });

    } catch (error) {
        console.log('error adding song to playlist',error)
    }
})
    

module.exports = router;