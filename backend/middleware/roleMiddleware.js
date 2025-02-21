const roleMiddleware = (requiredRoles) => {
    return (req, res, next) => {
        if(!req.user){
            res.status(401).json({ message: "Unauthorized"})
        }

        if(!requiredRoles.includes(req.user.role)){
            return res.status(403).json({message: "Forbidden, You don't have permission"})
        }

        next();
    }
}

module.exports = roleMiddleware