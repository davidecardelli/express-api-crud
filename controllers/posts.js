const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

function generateSlug(title, array) {

    if (!title || typeof title != "string") {
        throw new Error("kebab-case: il titolo non è presente o non è una stringa");
    } else if (!array) {
        throw new Error("kebab-case: devi passare un array come secondo argomento");
    };

    let slug = title.toLowerCase().trim().replaceAll(" ", "-");

    let counter = 2;
    let myString = slug;
    const mySlugArray = array.map((element) => element.slug.valueOf());

    while (mySlugArray.includes(myString)) {
        myString = `${slug}-${counter}`
        if (!mySlugArray.includes(myString)) {
            slug = myString;
        } else {
            counter++;
        }
    };

    return slug;
};

async function index(req, res, next) {

    try {
        const { published, search } = req.query;

        let whereCondition = {};

        if (published === "true") {
            whereCondition.published = true;
        }

        if (published === "false") {
            whereCondition.published = false;
        }

        if (search) {
            whereCondition.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
            ];
        }

        const result = await prisma.post.findMany({
            where: whereCondition,
        });

        res.json({ message: "Post trovati con successo", result });
    }
    catch (error) {
        next(error);
    }

};

async function store(req, res, next) {
    let requestUpdated;
    {
        try {

            const elements = await prisma.post.findMany();

            const request = { ...req.body };

            request.slug = generateSlug(request.title, elements);

            requestUpdated = request
        }
        catch (error) {
            next(error);
        }
    }


    try {
        const result = await prisma.post.create({
            data: requestUpdated
        });

        res.json({ "message": "post creato correttamente", result })
    } catch (error) {
        next(error);
    }
};

async function update(req, res, next) {

    let requestUpdated;
    if (req.body.title) {
        {
            try {

                const elements = await prisma.post.findMany();

                const request = { ...req.body };

                request.slug = generateSlug(request.title, elements);

                requestUpdated = request
            }
            catch (error) {
                next(error);
            }
        }
    } else {
        requestUpdated = req.body
    }


    try {
        const result = await prisma.post.update({
            where: {
                slug: req.params.slug
            },
            data: requestUpdated
        });

        res.json({ "message": "post modificato con successo", result })
    } catch (error) {
        next(error);
    }
};

async function show(req, res, next) {
    try {
        const result = await prisma.post.findUnique({
            where: {
                slug: req.params.slug
            }
        });

        res.json({ "message": "post trovato con successo", result });
    }
    catch (error) {
        next(error);
    }
};

async function destroy(req, res, next) {
    try {
        const result = await prisma.post.delete({
            where: {
                slug: req.params.slug
            }
        });

        res.json({ "message": "post trovato con successo", result });

    }
    catch (error) {
        next(error);
    }

};




module.exports = {
    index,
    store,
    update,
    show,
    destroy
}